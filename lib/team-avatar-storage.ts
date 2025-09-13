import { createClient } from '@supabase/supabase-js';

// Tạo client cho storage operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseStorage = createClient(supabaseUrl, supabaseServiceKey);

// Tên bucket cho team avatars
export const TEAM_AVATARS_BUCKET = 'team-avatars';

// Upload avatar mới và xóa ảnh cũ
export async function uploadTeamAvatar(
  memberId: string,
  file: File,
  oldAvatarUrl?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Tạo file name unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${memberId}-${Date.now()}.${fileExt}`;
    
    // Upload file mới
    const { error: uploadError } = await supabaseStorage.storage
      .from(TEAM_AVATARS_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Lấy public URL
    const { data: urlData } = supabaseStorage.storage
      .from(TEAM_AVATARS_BUCKET)
      .getPublicUrl(fileName);

    // Xóa ảnh cũ nếu có
    if (oldAvatarUrl && oldAvatarUrl.includes(TEAM_AVATARS_BUCKET)) {
      try {
        // Extract file name from URL
        const oldFileName = oldAvatarUrl.split('/').pop();
        if (oldFileName) {
          await supabaseStorage.storage
            .from(TEAM_AVATARS_BUCKET)
            .remove([oldFileName]);
        }
      } catch (deleteError) {
        console.warn('Failed to delete old avatar:', deleteError);
        // Continue anyway - new upload was successful
      }
    }

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

// Xóa avatar khi xóa team member
export async function deleteTeamAvatar(avatarUrl: string): Promise<void> {
  try {
    if (!avatarUrl || !avatarUrl.includes(TEAM_AVATARS_BUCKET)) {
      return;
    }

    const fileName = avatarUrl.split('/').pop();
    if (fileName) {
      await supabaseStorage.storage
        .from(TEAM_AVATARS_BUCKET)
        .remove([fileName]);
    }
  } catch (error) {
    console.warn('Failed to delete avatar:', error);
  }
}

// Tạo bucket nếu chưa có
export async function ensureTeamAvatarsBucket(): Promise<void> {
  try {
    const { data: buckets } = await supabaseStorage.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === TEAM_AVATARS_BUCKET);
    
    if (!bucketExists) {
      await supabaseStorage.storage.createBucket(TEAM_AVATARS_BUCKET, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 2 * 1024 * 1024, // 2MB
      });
    }
  } catch (error) {
    console.error('Failed to ensure bucket exists:', error);
  }
}