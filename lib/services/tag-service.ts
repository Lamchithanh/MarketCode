import { supabaseServiceRole } from '@/lib/supabase-server';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  usageCount?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateTagData {
  name: string;
  slug?: string;
  color?: string;
}

export interface UpdateTagData {
  name?: string;
  slug?: string;
  color?: string;
}

export interface TagFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface TagStats {
  total: number;
  active: number;
  deleted: number;
  usedInProducts: number;
}

export interface PaginatedTags {
  tags: Tag[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class TagService {
  private static instance: TagService;

  public static getInstance(): TagService {
    if (!TagService.instance) {
      TagService.instance = new TagService();
    }
    return TagService.instance;
  }

  /**
   * Get all tags with pagination and filtering
   */
  async getTags(filters: TagFilters = {}): Promise<PaginatedTags> {
    try {
      const {
        search = '',
        page = 1,
        limit = 20
      } = filters;

      let query = supabaseServiceRole
        .from('Tag')
        .select('*', { count: 'exact' })
        .is('deletedAt', null);

      // Apply search filter
      if (search) {
        query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
      }

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      // Order by creation date
      query = query.order('createdAt', { ascending: false });

      const { data: tags, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch tags: ${error.message}`);
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        tags: tags || [],
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Failed to fetch tags');
    }
  }

  /**
   * Get tag by ID
   */
  async getTagById(id: string): Promise<Tag | null> {
    try {
      const { data: tag, error } = await supabaseServiceRole
        .from('Tag')
        .select('*')
        .eq('id', id)
        .is('deletedAt', null)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Tag not found
        }
        throw new Error(`Failed to fetch tag: ${error.message}`);
      }

      return tag;
    } catch (error) {
      console.error('Error fetching tag:', error);
      throw error;
    }
  }

  /**
   * Get tag by slug
   */
  async getTagBySlug(slug: string): Promise<Tag | null> {
    try {
      const { data: tag, error } = await supabaseServiceRole
        .from('Tag')
        .select('*')
        .eq('slug', slug)
        .is('deletedAt', null)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Tag not found
        }
        throw new Error(`Failed to fetch tag: ${error.message}`);
      }

      return tag;
    } catch (error) {
      console.error('Error fetching tag by slug:', error);
      throw error;
    }
  }

  /**
   * Create new tag
   */
  async createTag(tagData: CreateTagData): Promise<Tag> {
    try {
      // Generate slug if not provided
      const slug = tagData.slug || this.generateSlug(tagData.name);

      // Check if tag already exists
      const existingTag = await this.getTagBySlug(slug);
      if (existingTag) {
        throw new Error('Tag with this slug already exists');
      }

      const { data: tag, error } = await supabaseServiceRole
        .from('Tag')
        .insert([{
          name: tagData.name,
          slug,
          color: tagData.color,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create tag: ${error.message}`);
      }

      return tag;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  /**
   * Update tag
   */
  async updateTag(id: string, tagData: UpdateTagData): Promise<Tag> {
    try {
      // Check if tag exists
      const existingTag = await this.getTagById(id);
      if (!existingTag) {
        throw new Error('Tag not found');
      }

      // Check if slug is being changed and if it's already taken
      if (tagData.slug && tagData.slug !== existingTag.slug) {
        const tagWithSlug = await this.getTagBySlug(tagData.slug);
        if (tagWithSlug) {
          throw new Error('Slug is already taken by another tag');
        }
      }

      const { data: tag, error } = await supabaseServiceRole
        .from('Tag')
        .update({
          ...tagData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update tag: ${error.message}`);
      }

      return tag;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  /**
   * Delete tag (soft delete)
   */
  async deleteTag(id: string): Promise<void> {
    try {
      const { error } = await supabaseServiceRole
        .from('Tag')
        .update({
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete tag: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }

  /**
   * Restore deleted tag
   */
  async restoreTag(id: string): Promise<Tag> {
    try {
      const { data: tag, error } = await supabaseServiceRole
        .from('Tag')
        .update({
          deletedAt: null,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to restore tag: ${error.message}`);
      }

      return tag;
    } catch (error) {
      console.error('Error restoring tag:', error);
      throw error;
    }
  }

  /**
   * Get tag statistics
   */
  async getTagStats(): Promise<TagStats> {
    try {
      // Get total counts
      const { count: total } = await supabaseServiceRole
        .from('Tag')
        .select('*', { count: 'exact', head: true })
        .is('deletedAt', null);

      const { count: deleted } = await supabaseServiceRole
        .from('Tag')
        .select('*', { count: 'exact', head: true })
        .not('deletedAt', 'is', null);

      const { count: usedInProducts } = await supabaseServiceRole
        .from('ProductTag')
        .select('tagId', { count: 'exact', head: true })
        .not('tagId', 'is', null);

      return {
        total: total || 0,
        active: total || 0,
        deleted: deleted || 0,
        usedInProducts: usedInProducts || 0
      };
    } catch (error) {
      console.error('Error fetching tag stats:', error);
      throw new Error('Failed to fetch tag statistics');
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
export const tagService = TagService.getInstance();
