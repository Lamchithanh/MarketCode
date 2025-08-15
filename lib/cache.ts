import { LRUCache } from 'lru-cache';

// Configure LRU cache for optimal performance
const cache = new LRUCache({
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes default TTL
  updateAgeOnGet: true, // Update age when accessed
  allowStale: true, // Allow stale items to be returned
  maxEntrySize: 1000, // Maximum size per entry (1KB)
});

export class CacheService {
  /**
   * Get a value from cache
   */
  static async get<T>(key: string): Promise<T | undefined> {
    return cache.get(key);
  }

  /**
   * Set a value in cache
   */
  static async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    cache.set(key, value, { ttl });
  }

  /**
   * Delete a specific key from cache
   */
  static async delete(key: string): Promise<void> {
    cache.delete(key);
  }

  /**
   * Invalidate cache keys matching a pattern
   */
  static async invalidate(pattern: string): Promise<void> {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  static async clear(): Promise<void> {
    cache.clear();
  }

  /**
   * Get cache statistics
   */
  static getStats() {
    return {
      size: cache.size,
      max: cache.max,
      ttl: cache.ttl,
      hits: cache.hits,
      misses: cache.misses,
    };
  }

  /**
   * Cache user data with proper TTL
   */
  static async cacheUser(userId: string, userData: any): Promise<void> {
    const key = `user:${userId}`;
    await this.set(key, userData, 1000 * 60 * 15); // 15 minutes
  }

  /**
   * Cache product data with proper TTL
   */
  static async cacheProduct(productId: string, productData: any): Promise<void> {
    const key = `product:${productId}`;
    await this.set(key, productData, 1000 * 60 * 30); // 30 minutes
  }

  /**
   * Cache user products list
   */
  static async cacheUserProducts(userId: string, products: any[]): Promise<void> {
    const key = `user_products:${userId}`;
    await this.set(key, products, 1000 * 60 * 10); // 10 minutes
  }

  /**
   * Cache category data
   */
  static async cacheCategory(categoryId: string, categoryData: any): Promise<void> {
    const key = `category:${categoryId}`;
    await this.set(key, categoryData, 1000 * 60 * 60); // 1 hour
  }

  /**
   * Cache search results
   */
  static async cacheSearch(query: string, results: any[]): Promise<void> {
    const key = `search:${query}`;
    await this.set(key, results, 1000 * 60 * 5); // 5 minutes
  }

  /**
   * Cache authentication tokens
   */
  static async cacheAuthToken(token: string, userData: any): Promise<void> {
    const key = `auth:${token}`;
    await this.set(key, userData, 1000 * 60 * 60); // 1 hour
  }

  /**
   * Invalidate user-related cache when user data changes
   */
  static async invalidateUserCache(userId: string): Promise<void> {
    await this.invalidate(`user:${userId}`);
    await this.invalidate(`user_products:${userId}`);
    await this.invalidate(`auth:`);
  }

  /**
   * Invalidate product-related cache when product changes
   */
  static async invalidateProductCache(productId: string): Promise<void> {
    await this.invalidate(`product:${productId}`);
    await this.invalidate(`search:`);
    await this.invalidate(`category:`);
  }
}

// Export cache instance for direct access if needed
export { cache };
