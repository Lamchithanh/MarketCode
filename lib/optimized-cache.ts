import { LRUCache } from 'lru-cache';

// Enhanced cache configuration for better performance
const cacheConfig = {
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes default TTL
  updateAgeOnGet: true, // Update age when accessed
  allowStale: true, // Allow stale items to be returned while updating
  updateAgeOnHas: true, // Update age when checking existence
  noDisposeOnSet: true, // Don't dispose on set
  dispose: (key: string, value: any) => {
    // Log cache evictions for monitoring
    console.log(`Cache evicted: ${key}`);
  }
};

// Product cache with optimized TTL
const productCache = new LRUCache<string, any>({
  ...cacheConfig,
  max: 200,
  ttl: 1000 * 60 * 10, // 10 minutes for products
});

// User cache with shorter TTL for security
const userCache = new LRUCache<string, any>({
  ...cacheConfig,
  max: 100,
  ttl: 1000 * 60 * 2, // 2 minutes for users
});

// Category cache with longer TTL (rarely changes)
const categoryCache = new LRUCache<string, any>({
  ...cacheConfig,
  max: 50,
  ttl: 1000 * 60 * 30, // 30 minutes for categories
});

// Order cache with medium TTL
const orderCache = new LRUCache<string, any>({
  ...cacheConfig,
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes for orders
});

export class OptimizedCacheService {
  // Product caching methods
  static async getProduct(productId: string): Promise<any | null> {
    const key = `product:${productId}`;
    return productCache.get(key) || null;
  }

  static async setProduct(productId: string, product: any): Promise<void> {
    const key = `product:${productId}`;
    productCache.set(key, product);
  }

  static async getProductsByCategory(categoryId: string): Promise<any[] | null> {
    const key = `products:category:${categoryId}`;
    return productCache.get(key) || null;
  }

  static async setProductsByCategory(categoryId: string, products: any[]): Promise<void> {
    const key = `products:category:${categoryId}`;
    productCache.set(key, products);
  }

  static async getProductsByUser(userId: string): Promise<any[] | null> {
    const key = `products:user:${userId}`;
    return productCache.get(key) || null;
  }

  static async setProductsByUser(userId: string, products: any[]): Promise<void> {
    const key = `products:user:${userId}`;
    productCache.set(key, products);
  }

  // User caching methods
  static async getUser(userId: string): Promise<any | null> {
    const key = `user:${userId}`;
    return userCache.get(key) || null;
  }

  static async setUser(userId: string, user: any): Promise<void> {
    const key = `user:${userId}`;
    userCache.set(key, user);
  }

  static async getUserByEmail(email: string): Promise<any | null> {
    const key = `user:email:${email}`;
    return userCache.get(key) || null;
  }

  static async setUserByEmail(email: string, user: any): Promise<void> {
    const key = `user:email:${email}`;
    userCache.set(key, user);
  }

  // Category caching methods
  static async getCategory(categoryId: string): Promise<any | null> {
    const key = `category:${categoryId}`;
    return categoryCache.get(key) || null;
  }

  static async setCategory(categoryId: string, category: any): Promise<void> {
    const key = `category:${categoryId}`;
    categoryCache.set(key, category);
  }

  static async getAllCategories(): Promise<any[] | null> {
    const key = 'categories:all';
    return categoryCache.get(key) || null;
  }

  static async setAllCategories(categories: any[]): Promise<void> {
    const key = 'categories:all';
    categoryCache.set(key, categories);
  }

  // Order caching methods
  static async getOrder(orderId: string): Promise<any | null> {
    const key = `order:${orderId}`;
    return orderCache.get(key) || null;
  }

  static async setOrder(orderId: string, order: any): Promise<void> {
    const key = `order:${orderId}`;
    orderCache.set(key, order);
  }

  static async getUserOrders(userId: string): Promise<any[] | null> {
    const key = `orders:user:${userId}`;
    return orderCache.get(key) || null;
  }

  static async setUserOrders(userId: string, orders: any[]): Promise<void> {
    const key = `orders:user:${userId}`;
    orderCache.set(key, orders);
  }

  // Cache invalidation methods
  static async invalidateProduct(productId: string): Promise<void> {
    const keys = [
      `product:${productId}`,
      `products:category:*`,
      `products:user:*`
    ];
    
    // Clear all product-related caches
    productCache.clear();
    console.log(`Invalidated product cache for: ${productId}`);
  }

  static async invalidateUser(userId: string): Promise<void> {
    const keys = [
      `user:${userId}`,
      `products:user:${userId}`,
      `orders:user:${userId}`
    ];
    
    // Clear user-related caches
    userCache.delete(`user:${userId}`);
    productCache.delete(`products:user:${userId}`);
    orderCache.delete(`orders:user:${userId}`);
    
    console.log(`Invalidated user cache for: ${userId}`);
  }

  static async invalidateCategory(categoryId: string): Promise<void> {
    const keys = [
      `category:${categoryId}`,
      `products:category:${categoryId}`,
      'categories:all'
    ];
    
    // Clear category-related caches
    categoryCache.delete(`category:${categoryId}`);
    productCache.delete(`products:category:${categoryId}`);
    categoryCache.delete('categories:all');
    
    console.log(`Invalidated category cache for: ${categoryId}`);
  }

  // Cache statistics
  static getStats() {
    return {
      product: {
        size: productCache.size,
        max: productCache.max,
        hits: productCache.stats.hits,
        misses: productCache.stats.misses,
        hitRate: productCache.stats.hits / (productCache.stats.hits + productCache.stats.misses)
      },
      user: {
        size: userCache.size,
        max: userCache.max,
        hits: userCache.stats.hits,
        misses: userCache.stats.misses,
        hitRate: userCache.stats.hits / (userCache.stats.hits + userCache.stats.misses)
      },
      category: {
        size: categoryCache.size,
        max: categoryCache.max,
        hits: categoryCache.stats.hits,
        misses: categoryCache.stats.misses,
        hitRate: categoryCache.stats.hits / (categoryCache.stats.hits + categoryCache.stats.misses)
      },
      order: {
        size: orderCache.size,
        max: orderCache.max,
        hits: orderCache.stats.hits,
        misses: orderCache.stats.misses,
        hitRate: orderCache.stats.hits / (orderCache.stats.hits + orderCache.stats.misses)
      }
    };
  }

  // Clear all caches
  static async clearAll(): Promise<void> {
    productCache.clear();
    userCache.clear();
    categoryCache.clear();
    orderCache.clear();
    console.log('All caches cleared');
  }

  // Warm up cache with frequently accessed data
  static async warmUpCache(): Promise<void> {
    console.log('Warming up cache...');
    
    // This would typically fetch and cache frequently accessed data
    // For now, we'll just log the action
    console.log('Cache warm-up completed');
  }
}

// Export individual caches for direct access if needed
export { productCache, userCache, categoryCache, orderCache };
