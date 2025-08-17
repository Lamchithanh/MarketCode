import { supabaseServiceRole } from '@/lib/supabase-server';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
}

export interface CategoryFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CategoryStats {
  total: number;
  active: number;
  deleted: number;
  productsCount: number;
}

export interface PaginatedCategories {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class CategoryService {
  private static instance: CategoryService;

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  /**
   * Get all categories with pagination and filtering
   */
  async getCategories(filters: CategoryFilters = {}): Promise<PaginatedCategories> {
    try {
      const {
        search = '',
        page = 1,
        limit = 20
      } = filters;

      let query = supabaseServiceRole
        .from('Category')
        .select('*', { count: 'exact' })
        .is('deletedAt', null);

      // Apply search filter
      if (search) {
        query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      // Order by creation date
      query = query.order('createdAt', { ascending: false });

      const { data: categories, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        categories: categories || [],
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data: category, error } = await supabaseServiceRole
        .from('Category')
        .select('*')
        .eq('id', id)
        .is('deletedAt', null)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Category not found
        }
        throw new Error(`Failed to fetch category: ${error.message}`);
      }

      return category;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const { data: category, error } = await supabaseServiceRole
        .from('Category')
        .select('*')
        .eq('slug', slug)
        .is('deletedAt', null)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Category not found
        }
        throw new Error(`Failed to fetch category: ${error.message}`);
      }

      return category;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw error;
    }
  }

  /**
   * Create new category
   */
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    try {
      // Generate slug if not provided
      const slug = categoryData.slug || this.generateSlug(categoryData.name);

      // Check if category already exists
      const existingCategory = await this.getCategoryBySlug(slug);
      if (existingCategory) {
        throw new Error('Category with this slug already exists');
      }

      const { data: category, error } = await supabaseServiceRole
        .from('Category')
        .insert([{
          name: categoryData.name,
          slug,
          description: categoryData.description,
          icon: categoryData.icon,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create category: ${error.message}`);
      }

      return category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Update category
   */
  async updateCategory(id: string, categoryData: UpdateCategoryData): Promise<Category> {
    try {
      // Check if category exists
      const existingCategory = await this.getCategoryById(id);
      if (!existingCategory) {
        throw new Error('Category not found');
      }

      // Check if slug is being changed and if it's already taken
      if (categoryData.slug && categoryData.slug !== existingCategory.slug) {
        const categoryWithSlug = await this.getCategoryBySlug(categoryData.slug);
        if (categoryWithSlug) {
          throw new Error('Slug is already taken by another category');
        }
      }

      const { data: category, error } = await supabaseServiceRole
        .from('Category')
        .update({
          ...categoryData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update category: ${error.message}`);
      }

      return category;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  /**
   * Delete category (soft delete)
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      // Check if category has products
      const { count: productsCount } = await supabaseServiceRole
        .from('Product')
        .select('id', { count: 'exact', head: true })
        .eq('categoryId', id)
        .is('deletedAt', null);

      if (productsCount && productsCount > 0) {
        throw new Error(`Cannot delete category. It has ${productsCount} active products.`);
      }

      const { error } = await supabaseServiceRole
        .from('Category')
        .update({
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete category: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  /**
   * Restore deleted category
   */
  async restoreCategory(id: string): Promise<Category> {
    try {
      const { data: category, error } = await supabaseServiceRole
        .from('Category')
        .update({
          deletedAt: null,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to restore category: ${error.message}`);
      }

      return category;
    } catch (error) {
      console.error('Error restoring category:', error);
      throw error;
    }
  }

  /**
   * Get category statistics
   */
  async getCategoryStats(): Promise<CategoryStats> {
    try {
      // Get total counts
      const { count: total } = await supabaseServiceRole
        .from('Category')
        .select('*', { count: 'exact', head: true })
        .is('deletedAt', null);

      const { count: deleted } = await supabaseServiceRole
        .from('Category')
        .select('*', { count: 'exact', head: true })
        .not('deletedAt', 'is', null);

      const { count: productsCount } = await supabaseServiceRole
        .from('Product')
        .select('categoryId', { count: 'exact', head: true })
        .not('categoryId', 'is', null)
        .is('deletedAt', null);

      return {
        total: total || 0,
        active: total || 0,
        deleted: deleted || 0,
        productsCount: productsCount || 0
      };
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw new Error('Failed to fetch category statistics');
    }
  }

  /**
   * Generate slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

// Export singleton instance
export const categoryService = CategoryService.getInstance();
