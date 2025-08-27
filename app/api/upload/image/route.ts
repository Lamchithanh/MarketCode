import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;
    const path = formData.get('path') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!bucket) {
      return NextResponse.json(
        { success: false, error: 'Bucket name is required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = path || `${timestamp}-${file.name}`;

    // Upload to Supabase Storage
    const { error } = await supabaseServiceRole.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseServiceRole.storage
      .from(bucket)
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filename
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
