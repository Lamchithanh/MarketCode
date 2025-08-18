import { supabaseServiceRole } from '@/lib/supabase-server';
import { StorageCleanupResult, extractImagePath } from '@/lib/storage-utils';

/**
 * Server-side storage utilities that use supabaseServiceRole
 */

/**
 * Delete image from Supabase storage (server-side only)
 */
export async function deleteImageFromStorage(imagePath: string): Promise<boolean> {
  try {
    const { error } = await supabaseServiceRole.storage
      .from('product-images')
      .remove([imagePath]);

    if (error) {
      console.error('Failed to delete image from storage:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image from storage:', error);
    return false;
  }
}

/**
 * Delete multiple images from storage (server-side only)
 */
export async function deleteMultipleImagesFromStorage(imagePaths: string[]): Promise<StorageCleanupResult> {
  const result: StorageCleanupResult = {
    deletedFiles: [],
    errors: []
  };

  for (const imagePath of imagePaths) {
    try {
      const success = await deleteImageFromStorage(imagePath);
      if (success) {
        result.deletedFiles.push(imagePath);
      } else {
        result.errors.push(`Failed to delete: ${imagePath}`);
      }
    } catch (error) {
      result.errors.push(`Error deleting ${imagePath}: ${error}`);
    }
  }

  return result;
}

/**
 * Clean up orphaned images that are no longer referenced in any product (server-side only)
 * WARNING: This is an expensive operation and should be run carefully
 */
export async function cleanupOrphanedImages(): Promise<StorageCleanupResult> {
  const result: StorageCleanupResult = {
    deletedFiles: [],
    errors: []
  };

  try {
    // Get all images from storage
    const { data: storageFiles, error: storageError } = await supabaseServiceRole.storage
      .from('product-images')
      .list('products');

    if (storageError) {
      result.errors.push(`Failed to list storage files: ${storageError.message}`);
      return result;
    }

    // Get all image URLs from products
    const { data: products, error: productsError } = await supabaseServiceRole
      .from('Product')
      .select('images')
      .is('deletedAt', null);

    if (productsError) {
      result.errors.push(`Failed to fetch products: ${productsError.message}`);
      return result;
    }

    // Collect all image paths currently in use
    const usedImagePaths = new Set<string>();
    products.forEach(product => {
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach((imageUrl: string) => {
          const path = extractImagePath(imageUrl);
          if (path) {
            usedImagePaths.add(path);
          }
        });
      }
    });

    // Find orphaned files
    const orphanedFiles = storageFiles.filter(file => {
      const fullPath = `products/${file.name}`;
      return !usedImagePaths.has(fullPath);
    });

    // Delete orphaned files
    if (orphanedFiles.length > 0) {
      const pathsToDelete = orphanedFiles.map(file => `products/${file.name}`);
      const cleanupResult = await deleteMultipleImagesFromStorage(pathsToDelete);
      
      result.deletedFiles = cleanupResult.deletedFiles;
      result.errors.push(...cleanupResult.errors);
    }

  } catch (error) {
    result.errors.push(`Cleanup operation failed: ${error}`);
  }

  return result;
}

/**
 * Get storage usage statistics (server-side only)
 */
export async function getStorageStats(): Promise<{
  totalFiles: number;
  totalSizeBytes: number;
  orphanedFiles?: number;
}> {
  try {
    const { data: files, error } = await supabaseServiceRole.storage
      .from('product-images')
      .list('products');

    if (error) {
      throw new Error(`Failed to get storage stats: ${error.message}`);
    }

    const totalFiles = files.length;
    const totalSizeBytes = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);

    return {
      totalFiles,
      totalSizeBytes
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    throw error;
  }
}
