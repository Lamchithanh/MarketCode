import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from '@supabase/supabase-js';

// Create service role client for server-side operations
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  }
);

export async function POST(req: NextRequest) {
  try {
    console.log('API: Avatar upload requested');
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('API: No session found');
      return NextResponse.json(
        { error: "Please login to upload avatar" },
        { status: 401 }
      );
    }

    console.log('API: Session found for user:', session.user.email);

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log('API: File received:', { name: file.name, size: file.size, type: file.type });

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
      return NextResponse.json(
        { error: 'Invalid file type. Only image files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Get user from database
    const { data: userData, error: userError } = await supabaseService
      .from('User')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      console.error('API: User not found:', userError);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log('API: User found:', userData.id);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userData.id}/avatar_${Date.now()}.${fileExt}`;
    console.log('API: Generated filename:', fileName);

    // Delete old avatar if exists
    const { data: oldFiles } = await supabaseService.storage
      .from('avatars')
      .list(userData.id);

    if (oldFiles && oldFiles.length > 0) {
      console.log('API: Deleting old avatars:', oldFiles.length);
      const filesToDelete = oldFiles.map((f: { name: string }) => `${userData.id}/${f.name}`);
      await supabaseService.storage
        .from('avatars')
        .remove(filesToDelete);
    }

    // Convert File to ArrayBuffer for upload
    const fileBuffer = await file.arrayBuffer();

    // Upload new avatar
    console.log('API: Uploading to storage...');
    const { error: uploadError } = await supabaseService.storage
      .from('avatars')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.error('API: Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload avatar' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseService.storage
      .from('avatars')
      .getPublicUrl(fileName);

    console.log('API: Got public URL:', urlData.publicUrl);

    // Update user profile with new avatar URL
    const { error: updateError } = await supabaseService
      .from('User')
      .update({ avatar: urlData.publicUrl })
      .eq('id', userData.id);

    if (updateError) {
      console.error('API: Profile update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    console.log('API: Avatar upload completed successfully');
    return NextResponse.json({ 
      avatarUrl: urlData.publicUrl,
      message: "Avatar updated successfully"
    });

  } catch (error) {
    console.error('API: Unexpected error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Please login to delete avatar" },
        { status: 401 }
      );
    }

    // Get user from database
    const { data: userData, error: userError } = await supabaseService
      .from('User')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // List user's avatars
    const { data: files, error: listError } = await supabaseService.storage
      .from('avatars')
      .list(userData.id);

    if (listError) {
      return NextResponse.json(
        { error: 'Failed to list avatar files' },
        { status: 500 }
      );
    }

    if (files && files.length > 0) {
      // Delete all user's avatar files
      const filesToDelete = files.map((f: { name: string }) => `${userData.id}/${f.name}`);
      const { error: deleteError } = await supabaseService.storage
        .from('avatars')
        .remove(filesToDelete);

      if (deleteError) {
        return NextResponse.json(
          { error: 'Failed to delete avatar files' },
          { status: 500 }
        );
      }

      // Update user profile to remove avatar URL
      const { error: updateError } = await supabaseService
        .from('User')
        .update({ avatar: null })
        .eq('id', userData.id);

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update profile' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      message: "Avatar deleted successfully" 
    });

  } catch (error) {
    console.error('Delete avatar error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
