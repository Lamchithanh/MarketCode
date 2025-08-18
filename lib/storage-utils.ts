/**
 * Utility functions for managing product images and storage cleanup
 * Client-safe utilities only
 */

export interface StorageCleanupResult {
  deletedFiles: string[];
  errors: string[];
}

/**
 * Extract image path from Supabase storage URL
 */
export function extractImagePath(imageUrl: string): string | null {
  if (!imageUrl) return null;
  
  // Extract path from Supabase storage URL
  // Format: https://[project].supabase.co/storage/v1/object/public/product-images/[path]
  const match = imageUrl.match(/\/storage\/v1\/object\/public\/product-images\/(.+)$/);
  return match ? match[1] : null;
}
