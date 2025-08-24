import { supabaseServiceRole } from '@/lib/supabase-server';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: string;
  emailVerified?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
  avatar?: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'USER' | 'ADMIN';
  avatar?: string;
  isActive?: boolean;
}

export interface UserFilters {
  search?: string;
  role?: 'USER' | 'ADMIN';
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface UserStats {
  total: number;
  verified: number;
  unverified: number;
  admins: number;
  regular: number;
  recent: number;
  buyers: number;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserService {
  private static instance: UserService;

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get all users with pagination and filtering
   */
  async getUsers(filters: UserFilters = {}): Promise<PaginatedUsers> {
    try {
      const {
        search = '',
        role,
        isActive,
        page = 1,
        limit = 20
      } = filters;

      let query = supabaseServiceRole
        .from('User')
        .select('*', { count: 'exact' })
        .is('deletedAt', null);

      // Apply search filter
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Apply role filter
      if (role) {
        query = query.eq('role', role);
      }

      // Apply active status filter
      if (isActive !== undefined) {
        query = query.eq('isActive', isActive);
      }

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      // Order by creation date
      query = query.order('createdAt', { ascending: false });

      const { data: users, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        users: users || [],
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      console.log('Attempting to fetch user by ID:', id);
      
      const { data: user, error } = await supabaseServiceRole
        .from('User')
        .select('*')
        .eq('id', id)
        .is('deletedAt', null)
        .single();

      if (error) {
        console.error('Supabase error in getUserById:', error);
        if (error.code === 'PGRST116') {
          console.log('User not found (PGRST116)');
          return null; // User not found
        }
        throw new Error(`Failed to fetch user: ${error.message}`);
      }

      console.log('User fetched successfully:', user.id);
      return user;
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      console.log('Attempting to create user with email:', userData.email);
      
      // Check if user already exists (including soft-deleted ones)
      const { data: existingUser, error: checkError } = await supabaseServiceRole
        .from('User')
        .select('id, deletedAt')
        .eq('email', userData.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError);
        throw new Error(`Failed to check existing user: ${checkError.message}`);
      }

      if (existingUser) {
        if (existingUser.deletedAt) {
          // User exists but is soft-deleted, restore and update
          console.log('User exists but is soft-deleted, restoring...');
          const { data: restoredUser, error: restoreError } = await supabaseServiceRole
            .from('User')
            .update({
              name: userData.name,
              password: userData.password,
              role: userData.role || 'USER',
              avatar: userData.avatar,
              isActive: userData.isActive ?? true,
              deletedAt: null,
              updatedAt: new Date().toISOString()
            })
            .eq('id', existingUser.id)
            .select()
            .single();

          if (restoreError) {
            throw new Error(`Failed to restore user: ${restoreError.message}`);
          }

          return restoredUser;
        } else {
          // User exists and is active
          throw new Error('User with this email already exists');
        }
      }

      // Create new user
      const { data: user, error } = await supabaseServiceRole
        .from('User')
        .insert([{
          name: userData.name,
          email: userData.email,
          password: userData.password, // Note: In production, hash this password
          role: userData.role || 'USER',
          avatar: userData.avatar,
          isActive: userData.isActive ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw new Error(`Failed to create user: ${error.message}`);
      }

      console.log('User created successfully:', user.id);
      return user;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      // Check if user exists
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      // Check if email is being changed and if it's already taken
      if (userData.email && userData.email !== existingUser.email) {
        const { data: emailExists } = await supabaseServiceRole
          .from('User')
          .select('id')
          .eq('email', userData.email)
          .is('deletedAt', null)
          .neq('id', id)
          .single();

        if (emailExists) {
          throw new Error('Email is already taken by another user');
        }
      }

      const { data: user, error } = await supabaseServiceRole
        .from('User')
        .update({
          ...userData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: string): Promise<void> {
    try {
      console.log('Attempting to delete user:', id);
      
      // Try soft delete first
      const { error: softDeleteError } = await supabaseServiceRole
        .from('User')
        .update({
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (softDeleteError) {
        console.error('Soft delete failed, trying hard delete:', softDeleteError);
        
        // Fallback to hard delete
        const { error: hardDeleteError } = await supabaseServiceRole
          .from('User')
          .delete()
          .eq('id', id);
          
        if (hardDeleteError) {
          console.error('Hard delete also failed:', hardDeleteError);
          throw new Error(`Failed to delete user: ${hardDeleteError.message}`);
        }
      }
      
      console.log('User deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Restore deleted user
   */
  async restoreUser(id: string): Promise<User> {
    try {
      const { data: user, error } = await supabaseServiceRole
        .from('User')
        .update({
          deletedAt: null,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to restore user: ${error.message}`);
      }

      return user;
    } catch (error) {
      console.error('Error restoring user:', error);
      throw error;
    }
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(id: string): Promise<User> {
    try {
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      const { data: user, error } = await supabaseServiceRole
        .from('User')
        .update({
          isActive: !existingUser.isActive,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to toggle user status: ${error.message}`);
      }

      return user;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get total counts
      const { count: total } = await supabaseServiceRole
        .from('User')
        .select('*', { count: 'exact', head: true })
        .is('deletedAt', null);

      const { count: active } = await supabaseServiceRole
        .from('User')
        .select('*', { count: 'exact', head: true })
        .is('deletedAt', null)
        .eq('isActive', true);

      const { count: admins } = await supabaseServiceRole
        .from('User')
        .select('*', { count: 'exact', head: true })
        .is('deletedAt', null)
        .eq('role', 'ADMIN');

      const { count: newThisMonth } = await supabaseServiceRole
        .from('User')
        .select('*', { count: 'exact', head: true })
        .is('deletedAt', null)
        .gte('createdAt', startOfMonth.toISOString());

      return {
        total: total || 0,
        verified: active || 0, // Using active count as verified (placeholder)
        unverified: (total || 0) - (active || 0),
        admins: admins || 0,
        regular: (total || 0) - (admins || 0),
        recent: newThisMonth || 0,
        buyers: 0 // Placeholder, would need to calculate from orders
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user statistics');
    }
  }

  /**
   * Update user last login
   */
  async updateLastLogin(id: string): Promise<void> {
    try {
      const { error } = await supabaseServiceRole
        .from('User')
        .update({
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating last login:', error);
      }
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  /**
   * Verify user email
   */
  async verifyEmail(id: string): Promise<User> {
    try {
      const { data: user, error } = await supabaseServiceRole
        .from('User')
        .update({
          emailVerified: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to verify email: ${error.message}`);
      }

      return user;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = UserService.getInstance();
