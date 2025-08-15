import { supabase } from './supabase';
import { OptimizedCacheService } from './optimized-cache';

export class OptimizedDatabaseService {
  // Product methods with caching
  static async getProduct(productId: string) {
    // Try cache first
    const cached = await OptimizedCacheService.getProduct(productId);
    if (cached) {
      console.log(`Cache hit for product: ${productId}`);
      return cached;
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('Product')
      .select(`
        *,
        Category(name, slug, description),
        User(name, id),
        Review(rating, comment)
      `)
      .eq('id', productId)
      .eq('isActive', true)
      .is('deletedAt', null)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    // Cache the result
    await OptimizedCacheService.setProduct(productId, data);
    console.log(`Cache miss for product: ${productId}, cached result`);
    
    return data;
  }

  static async getProductsByCategory(categoryId: string, limit = 20, offset = 0) {
    const cacheKey = `${categoryId}:${limit}:${offset}`;
    
    // Try cache first
    const cached = await OptimizedCacheService.getProductsByCategory(cacheKey);
    if (cached) {
      console.log(`Cache hit for products by category: ${categoryId}`);
      return cached;
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('Product')
      .select(`
        *,
        Category(name, slug),
        User(name, id),
        Review(rating)
      `)
      .eq('categoryId', categoryId)
      .eq('isActive', true)
      .is('deletedAt', null)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    // Cache the result
    await OptimizedCacheService.setProductsByCategory(cacheKey, data);
    console.log(`Cache miss for products by category: ${categoryId}, cached result`);
    
    return data;
  }

  static async getAllProducts(limit = 20, offset = 0) {
    // Fetch from database (no caching for this as it's too dynamic)
    const { data, error } = await supabase
      .from('Product')
      .select(`
        *,
        Category(name, slug),
        User(name, id),
        Review(rating)
      `)
      .eq('isActive', true)
      .is('deletedAt', null)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching all products:', error);
      return [];
    }

    return data;
  }

  // User methods with caching
  static async getUser(userId: string) {
    // Try cache first
    const cached = await OptimizedCacheService.getUser(userId);
    if (cached) {
      console.log(`Cache hit for user: ${userId}`);
      return cached;
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', userId)
      .eq('isActive', true)
      .is('deletedAt', null)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    // Cache the result
    await OptimizedCacheService.setUser(userId, data);
    console.log(`Cache miss for user: ${userId}, cached result`);
    
    return data;
  }

  static async getUserByEmail(email: string) {
    // Try cache first
    const cached = await OptimizedCacheService.getUserByEmail(email);
    if (cached) {
      console.log(`Cache hit for user by email: ${email}`);
      return cached;
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .eq('isActive', true)
      .is('deletedAt', null)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }

    // Cache the result
    await OptimizedCacheService.setUserByEmail(email, data);
    console.log(`Cache miss for user by email: ${email}, cached result`);
    
    return data;
  }

  // Category methods with caching
  static async getCategory(categoryId: string) {
    // Try cache first
    const cached = await OptimizedCacheService.getCategory(categoryId);
    if (cached) {
      console.log(`Cache hit for category: ${categoryId}`);
      return cached;
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('Category')
      .select('*')
      .eq('id', categoryId)
      .is('deletedAt', null)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }

    // Cache the result
    await OptimizedCacheService.setCategory(categoryId, data);
    console.log(`Cache miss for category: ${categoryId}, cached result`);
    
    return data;
  }

  static async getAllCategories() {
    // Try cache first
    const cached = await OptimizedCacheService.getAllCategories();
    if (cached) {
      console.log('Cache hit for all categories');
      return cached;
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('Category')
      .select('*')
      .is('deletedAt', null)
      .order('name');

    if (error) {
      console.error('Error fetching all categories:', error);
      return [];
    }

    // Cache the result
    await OptimizedCacheService.setAllCategories(data);
    console.log('Cache miss for all categories, cached result');
    
    return data;
  }

  // Order methods with caching
  static async getOrder(orderId: string) {
    // Try cache first
    const cached = await OptimizedCacheService.getOrder(orderId);
    if (cached) {
      console.log(`Cache hit for order: ${orderId}`);
      return cached;
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('Order')
      .select(`
        *,
        User(name, email),
        OrderItem(*)
      `)
      .eq('id', orderId)
      .is('deletedAt', null)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    // Cache the result
    await OptimizedCacheService.setOrder(orderId, data);
    console.log(`Cache miss for order: ${orderId}, cached result`);
    
    return data;
  }

  static async getUserOrders(userId: string) {
    // Try cache first
    const cached = await OptimizedCacheService.getUserOrders(userId);
    if (cached) {
      console.log(`Cache hit for user orders: ${userId}`);
      return cached;
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('Order')
      .select(`
        *,
        OrderItem(*)
      `)
      .eq('buyerId', userId)
      .is('deletedAt', null)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }

    // Cache the result
    await OptimizedCacheService.setUserOrders(userId, data);
    console.log(`Cache miss for user orders: ${userId}, cached result`);
    
    return data;
  }

  // Search methods with optimized queries
  static async searchProducts(query: string, categoryId?: string, limit = 20, offset = 0) {
    let supabaseQuery = supabase
      .from('Product')
      .select(`
        *,
        Category(name, slug),
        User(name, id),
        Review(rating)
      `)
      .eq('isActive', true)
      .is('deletedAt', null)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    if (categoryId) {
      supabaseQuery = supabaseQuery.eq('categoryId', categoryId);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    return data;
  }

  // Cache management methods
  static async invalidateProductCache(productId: string) {
    await OptimizedCacheService.invalidateProduct(productId);
  }

  static async invalidateUserCache(userId: string) {
    await OptimizedCacheService.invalidateUser(userId);
  }

  static async invalidateCategoryCache(categoryId: string) {
    await OptimizedCacheService.invalidateCategory(categoryId);
  }

  static getCacheStats() {
    return OptimizedCacheService.getStats();
  }

  static async clearAllCaches() {
    await OptimizedCacheService.clearAll();
  }

  // Performance monitoring
  static async getDatabaseStats() {
    try {
      // Get table sizes using the function we created
      const { data: tableSizes, error: tableError } = await supabase
        .rpc('get_table_sizes');

      if (tableError) {
        console.error('Error getting table sizes:', tableError);
        return null;
      }

      return {
        tableSizes,
        cacheStats: this.getCacheStats(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      return null;
    }
  }
}

// Export individual methods for convenience
export const {
  getProduct,
  getProductsByCategory,
  getAllProducts,
  getUser,
  getUserByEmail,
  getCategory,
  getAllCategories,
  getOrder,
  getUserOrders,
  searchProducts,
  invalidateProductCache,
  invalidateUserCache,
  invalidateCategoryCache,
  getCacheStats,
  clearAllCaches,
  getDatabaseStats
} = OptimizedDatabaseService;
