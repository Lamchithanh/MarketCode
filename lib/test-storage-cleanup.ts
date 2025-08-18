import { cleanupOrphanedImages, getStorageStats } from '@/lib/storage-server-utils';

/**
 * Test script to verify storage cleanup functionality
 * Run this script to test if orphaned images are properly cleaned up
 */

async function testStorageCleanup() {
  try {
    console.log('=== Storage Cleanup Test ===');
    
    // Get current storage stats
    console.log('\n1. Getting current storage stats...');
    const statsBefore = await getStorageStats();
    console.log('Total files before cleanup:', statsBefore.totalFiles);
    console.log('Total size before cleanup:', (statsBefore.totalSizeBytes / 1024 / 1024).toFixed(2), 'MB');
    
    // Run cleanup
    console.log('\n2. Running cleanup...');
    const cleanupResult = await cleanupOrphanedImages();
    
    console.log('Deleted files:', cleanupResult.deletedFiles.length);
    console.log('Errors:', cleanupResult.errors.length);
    
    if (cleanupResult.deletedFiles.length > 0) {
      console.log('Deleted files list:');
      cleanupResult.deletedFiles.forEach(file => {
        console.log('  -', file);
      });
    }
    
    if (cleanupResult.errors.length > 0) {
      console.log('Errors:');
      cleanupResult.errors.forEach(error => {
        console.log('  -', error);
      });
    }
    
    // Get storage stats after cleanup
    console.log('\n3. Getting storage stats after cleanup...');
    const statsAfter = await getStorageStats();
    console.log('Total files after cleanup:', statsAfter.totalFiles);
    console.log('Total size after cleanup:', (statsAfter.totalSizeBytes / 1024 / 1024).toFixed(2), 'MB');
    
    const savedSpace = statsBefore.totalSizeBytes - statsAfter.totalSizeBytes;
    console.log('Space saved:', (savedSpace / 1024 / 1024).toFixed(2), 'MB');
    
    console.log('\n=== Test Completed Successfully ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Export for use in API routes or scripts
export { testStorageCleanup };
