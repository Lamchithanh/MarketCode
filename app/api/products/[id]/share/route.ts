import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseServiceRole } from '@/lib/supabase-server';

interface ShareProductParams {
  params: {
    id: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: ShareProductParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const productId = params.id;
    const body = await request.json();
    const { platform } = body;

    // Validate platform
    const validPlatforms = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email', 'copy_link'];
    if (!platform || !validPlatforms.includes(platform)) {
      return NextResponse.json(
        { success: false, error: 'Invalid platform' },
        { status: 400 }
      );
    }

    // Check if product exists
    const { data: product, error: productError } = await supabaseServiceRole
      .from('Product')
      .select('id, title, isActive')
      .eq('id', productId)
      .eq('isActive', true)
      .is('deletedAt', null)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Record the share (using ON CONFLICT to handle duplicates)
    const { error: shareError } = await supabaseServiceRole
      .from('ProductShare')
      .upsert({
        userId: session.user.id,
        productId: productId,
        platform: platform
      }, {
        onConflict: 'userId,productId,platform',
        ignoreDuplicates: false
      });

    if (shareError) {
      console.error('Error recording product share:', shareError);
      // Don't fail the API call if recording fails
    }

    // Generate share URLs based on platform
    const productUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/products/${productId}`;
    const shareText = `Xem sản phẩm tuyệt vời này: ${product.title}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Sản phẩm hay: ${product.title}`)}&body=${encodeURIComponent(`${shareText}\n\n${productUrl}`)}`;
        break;
      case 'copy_link':
        shareUrl = productUrl;
        break;
    }

    return NextResponse.json({
      success: true,
      data: {
        shareUrl,
        message: 'Product shared successfully'
      }
    });

  } catch (error) {
    console.error('Product share API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
