import { supabaseServiceRole } from '@/lib/supabase-server';
import { extractImagePath } from '@/lib/storage-utils';
import { deleteImageFromStorage } from '@/lib/storage-server-utils';

export interface Product {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  thumbnailUrl?: string;
  images?: string[]; // Array of up to 4 image URLs
  fileUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  downloadCount: number;
  viewCount: number;
  isActive: boolean;
  technologies?: string[];
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // Relations
  category?: Category;
  user?: User;
  tags?: Tag[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface CreateProductData {
  userId: string;
  categoryId: string;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  thumbnailUrl?: string;
  images?: string[];
  fileUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies?: string[];
  fileSize?: number;
  isActive?: boolean;
  tagIds?: string[];
}

export interface UpdateProductData {
  categoryId?: string;
  title?: string;
  slug?: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string;
  images?: string[];
  fileUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies?: string[];
  fileSize?: number;
  isActive?: boolean;
  tagIds?: string[];
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  userId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  technologies?: string[];
  tagIds?: string[];
  page?: number;
  limit?: number;
}

export interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  totalDownloads: number;
  totalViews: number;
  totalRevenue: number;
  byCategory: { [categoryId: string]: number };
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductService {
  private static instance: ProductService;

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Get all products with pagination and filtering
   */
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
    try {
      const {
        search = '',
        categoryId,
        userId,
        isActive,
        minPrice,
        maxPrice,
        technologies,
        tagIds,
        page = 1,
        limit = 20
      } = filters;

      let query = supabaseServiceRole
        .from('Product')
        .select(`
          *,
          category:Category(id, name, slug, description, icon),
          user:User(id, name, email, avatar)
        `, { count: 'exact' })
        .is('deletedAt', null);

      // Apply search filter
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Apply category filter
      if (categoryId) {
        query = query.eq('categoryId', categoryId);
      }

      // Apply user filter
      if (userId) {
        query = query.eq('userId', userId);
      }

      // Apply active status filter
      if (isActive !== undefined) {
        query = query.eq('isActive', isActive);
      }

      // Apply price filters
      if (minPrice !== undefined) {
        query = query.gte('price', minPrice);
      }
      if (maxPrice !== undefined) {
        query = query.lte('price', maxPrice);
      }

      // Apply technologies filter
      if (technologies && technologies.length > 0) {
        query = query.overlaps('technologies', technologies);
      }

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      // Order by creation date
      query = query.order('createdAt', { ascending: false });

      const { data: products, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      // If tag filtering is required, filter products by tags
      let filteredProducts = products || [];
      
      // Debug: Log raw Supabase data for first product  
      if (filteredProducts.length > 0) {
        const firstProduct = filteredProducts[0];
        if (firstProduct.title === 'Test Product with Images') {
          console.log('ProductService - Raw Supabase data:', {
            title: firstProduct.title,
            images: firstProduct.images,
            githubUrl: firstProduct.githubUrl,
            demoUrl: firstProduct.demoUrl
          });
        }
      }
      
      if (tagIds && tagIds.length > 0) {
        const productsWithTags = await this.getProductsByTags(tagIds);
        const productIds = new Set(productsWithTags.map(p => p.productId));
        filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
      }

      // Load tags for each product
      const productsWithTags = await Promise.all(
        filteredProducts.map(async (product) => {
          const tags = await this.getProductTags(product.id);
          const result = { ...product, tags };
          
          // Debug: Log transformation for first product
          if (product.title === 'Test Product with Images') {
            console.log('ProductService - Before transform:', {
              title: product.title,
              images: product.images,
              githubUrl: product.githubUrl,
              demoUrl: product.demoUrl
            });
            console.log('ProductService - After transform:', {
              title: result.title,
              images: result.images,
              githubUrl: result.githubUrl,
              demoUrl: result.demoUrl
            });
          }
          
          return result;
        })
      );

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        products: productsWithTags,
        total: filteredProducts.length,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data: product, error } = await supabaseServiceRole
        .from('Product')
        .select(`
          *,
          category:Category(id, name, slug, description, icon),
          user:User(id, name, email, avatar)
        `)
        .eq('id', id)
        .is('deletedAt', null)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Product not found
        }
        throw new Error(`Failed to fetch product: ${error.message}`);
      }

      // Get tags for this product
      if (product) {
        const tags = await this.getProductTags(id);
        product.tags = tags;
      }

      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const { data: product, error } = await supabaseServiceRole
        .from('Product')
        .select(`
          *,
          category:Category(id, name, slug, description, icon),
          user:User(id, name, email, avatar)
        `)
        .eq('slug', slug)
        .is('deletedAt', null)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Product not found
        }
        throw new Error(`Failed to fetch product: ${error.message}`);
      }

      // Get tags for this product
      if (product) {
        const tags = await this.getProductTags(product.id);
        product.tags = tags;
      }

      return product;
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      throw error;
    }
  }

  /**
   * Create new product
   */
  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      // Generate slug if not provided
      const slug = productData.slug || this.generateSlug(productData.title);

      // Check if product already exists
      const existingProduct = await this.getProductBySlug(slug);
      if (existingProduct) {
        throw new Error('Product with this slug already exists');
      }

      const { data: product, error } = await supabaseServiceRole
        .from('Product')
        .insert([{
          userId: productData.userId,
          categoryId: productData.categoryId,
          title: productData.title,
          slug,
          description: productData.description,
          price: productData.price,
          thumbnailUrl: productData.thumbnailUrl,
          images: productData.images || [],
          fileUrl: productData.fileUrl,
          demoUrl: productData.demoUrl,
          githubUrl: productData.githubUrl,
          technologies: productData.technologies || [],
          fileSize: productData.fileSize,
          isActive: productData.isActive ?? true,
          downloadCount: 0,
          viewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create product: ${error.message}`);
      }

      // Add tags if provided
      if (productData.tagIds && productData.tagIds.length > 0) {
        await this.addProductTags(product.id, productData.tagIds);
      }

      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update product
   */
  async updateProduct(id: string, productData: UpdateProductData): Promise<Product> {
    try {
      // Check if product exists
      const existingProduct = await this.getProductById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      // Check if slug is being changed and if it's already taken
      if (productData.slug && productData.slug !== existingProduct.slug) {
        const productWithSlug = await this.getProductBySlug(productData.slug);
        if (productWithSlug) {
          throw new Error('Slug is already taken by another product');
        }
      }

      // Handle image cleanup if images are being updated
      if (productData.images !== undefined) {
        const oldImages = existingProduct.images || [];
        const newImages = productData.images || [];

        // Find images that need to be deleted (old images not in new images)
        const imagesToDelete = oldImages.filter(oldImage => !newImages.includes(oldImage));

        // Delete old images from storage
        for (const imageUrl of imagesToDelete) {
          const imagePath = extractImagePath(imageUrl);
          if (imagePath) {
            await deleteImageFromStorage(imagePath);
          }
        }
      }

      const { data: product, error } = await supabaseServiceRole
        .from('Product')
        .update({
          ...productData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update product: ${error.message}`);
      }

      // Update tags if provided
      if (productData.tagIds) {
        await this.updateProductTags(id, productData.tagIds);
      }

      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete product (soft delete)
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      // Get product to access its images before deletion
      const existingProduct = await this.getProductById(id);
      
      const { error } = await supabaseServiceRole
        .from('Product')
        .update({
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete product: ${error.message}`);
      }

      // Delete all product images from storage
      if (existingProduct?.images?.length) {
        for (const imageUrl of existingProduct.images) {
          const imagePath = extractImagePath(imageUrl);
          if (imagePath) {
            await deleteImageFromStorage(imagePath);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  /**
   * Restore deleted product
   */
  async restoreProduct(id: string): Promise<Product> {
    try {
      const { data: product, error } = await supabaseServiceRole
        .from('Product')
        .update({
          deletedAt: null,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to restore product: ${error.message}`);
      }

      return product;
    } catch (error) {
      console.error('Error restoring product:', error);
      throw error;
    }
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<void> {
    try {
      const { error } = await supabaseServiceRole
        .from('Product')
        .update({
          viewCount: supabaseServiceRole.rpc('increment', { row_id: id, column_name: 'viewCount' }),
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error incrementing view count:', error);
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  /**
   * Increment download count
   */
  async incrementDownloadCount(id: string): Promise<void> {
    try {
      const { error } = await supabaseServiceRole
        .from('Product')
        .update({
          downloadCount: supabaseServiceRole.rpc('increment', { row_id: id, column_name: 'downloadCount' }),
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error incrementing download count:', error);
      }
    } catch (error) {
      console.error('Error incrementing download count:', error);
    }
  }

  /**
   * Get product tags
   */
  async getProductTags(productId: string): Promise<Tag[]> {
    try {
      const { data: productTags, error } = await supabaseServiceRole
        .from('ProductTag')
        .select(`
          tag:Tag(id, name, slug, color)
        `)
        .eq('productId', productId);

      if (error) {
        throw new Error(`Failed to fetch product tags: ${error.message}`);
      }

      return productTags?.map((pt: any) => pt.tag as Tag).filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching product tags:', error);
      return [];
    }
  }

  /**
   * Add tags to product
   */
  async addProductTags(productId: string, tagIds: string[]): Promise<void> {
    try {
      const productTags = tagIds.map(tagId => ({
        productId,
        tagId,
        createdAt: new Date().toISOString()
      }));

      const { error } = await supabaseServiceRole
        .from('ProductTag')
        .insert(productTags);

      if (error) {
        throw new Error(`Failed to add product tags: ${error.message}`);
      }
    } catch (error) {
      console.error('Error adding product tags:', error);
      throw error;
    }
  }

  /**
   * Update product tags
   */
  async updateProductTags(productId: string, tagIds: string[]): Promise<void> {
    try {
      // Remove existing tags
      const { error: deleteError } = await supabaseServiceRole
        .from('ProductTag')
        .delete()
        .eq('productId', productId);

      if (deleteError) {
        throw new Error(`Failed to remove existing product tags: ${deleteError.message}`);
      }

      // Add new tags
      if (tagIds.length > 0) {
        await this.addProductTags(productId, tagIds);
      }
    } catch (error) {
      console.error('Error updating product tags:', error);
      throw error;
    }
  }

  /**
   * Get products by tags
   */
  async getProductsByTags(tagIds: string[]): Promise<{ productId: string; tagId: string }[]> {
    try {
      const { data: productTags, error } = await supabaseServiceRole
        .from('ProductTag')
        .select('productId, tagId')
        .in('tagId', tagIds);

      if (error) {
        throw new Error(`Failed to fetch products by tags: ${error.message}`);
      }

      return productTags || [];
    } catch (error) {
      console.error('Error fetching products by tags:', error);
      return [];
    }
  }

  /**
   * Get product statistics
   */
  async getProductStats(): Promise<ProductStats> {
    try {
      // Get total counts
      const { count: total } = await supabaseServiceRole
        .from('Product')
        .select('*', { count: 'exact', head: true })
        .is('deletedAt', null);

      const { count: active } = await supabaseServiceRole
        .from('Product')
        .select('*', { count: 'exact', head: true })
        .is('deletedAt', null)
        .eq('isActive', true);

      // Get download and view counts
      const { data: stats } = await supabaseServiceRole
        .from('Product')
        .select('downloadCount, viewCount, price, categoryId')
        .is('deletedAt', null)
        .eq('isActive', true);

      const totalDownloads = stats?.reduce((sum, p) => sum + (p.downloadCount || 0), 0) || 0;
      const totalViews = stats?.reduce((sum, p) => sum + (p.viewCount || 0), 0) || 0;
      const totalRevenue = stats?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;

      // Get category counts
      const byCategory: { [categoryId: string]: number } = {};
      stats?.forEach(p => {
        if (p.categoryId) {
          byCategory[p.categoryId] = (byCategory[p.categoryId] || 0) + 1;
        }
      });

      return {
        total: total || 0,
        active: active || 0,
        inactive: (total || 0) - (active || 0),
        totalDownloads,
        totalViews,
        totalRevenue,
        byCategory
      };
    } catch (error) {
      console.error('Error fetching product stats:', error);
      throw new Error('Failed to fetch product statistics');
    }
  }

  /**
   * Generate slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

// Export singleton instance
export const productService = ProductService.getInstance();
