export class AvatarService {
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    console.log('AvatarService: Starting upload process...');
    
    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/bmp',
      'image/tiff'
    ];

    if (!allowedTypes.includes(file.type)) {
      console.error('AvatarService: Invalid file type:', file.type);
      throw new Error('Invalid file type. Only image files are allowed.');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('AvatarService: File too large:', file.size);
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    console.log('AvatarService: File validation passed, uploading via API...');

    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    // Upload via API route
    const response = await fetch('/api/user/avatar', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AvatarService: API error:', errorData);
      throw new Error(errorData.error || 'Failed to upload avatar');
    }

    const data = await response.json();
    console.log('AvatarService: Upload completed successfully!', data);
    return { avatarUrl: data.avatarUrl };
  }

  async deleteAvatar(): Promise<void> {
    console.log('AvatarService: Deleting avatar via API...');
    
    const response = await fetch('/api/user/avatar', {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AvatarService: Delete API error:', errorData);
      throw new Error(errorData.error || 'Failed to delete avatar');
    }

    console.log('AvatarService: Avatar deleted successfully!');
  }
}

export const avatarService = new AvatarService();
