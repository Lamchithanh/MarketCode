import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch comprehensive user data for 5 focused tasks
    const [userResult, reviewsResult, cartResult, shareResult, gitCodeUsageResult] = await Promise.all([
      // User profile
      supabaseServiceRole
        .from('User')
        .select('name, email, avatar, emailVerified, createdAt')
        .eq('id', userId)
        .single(),
      
      // Reviews data  
      supabaseServiceRole
        .from('Review')
        .select('id')
        .eq('userId', userId),
      
      // Cart data
      supabaseServiceRole
        .from('Cart')
        .select('id')
        .eq('userId', userId),

      // Product shares data
      supabaseServiceRole
        .from('ProductShare')
        .select('id')
        .eq('userId', userId),

      // GitCode usage data
      supabaseServiceRole
        .from('GitCodeUsage')
        .select('id')
        .eq('userId', userId)
    ]);

    if (userResult.error) {
      console.error('Error fetching user:', userResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    const user = userResult.data;
    const reviews = reviewsResult.data || [];
    const cartItems = cartResult.data || [];
    const productShares = shareResult.data || [];
    const gitCodeUsages = gitCodeUsageResult.data || [];

    // Calculate focused 5-task progress
    let totalPoints = 0;
    const maxPoints = 100;
    const achievements = [];

    // 5 focused tasks (20 points each)
    const focusedTasks = [
      { 
        key: 'avatar', 
        label: 'Cập nhật hình ảnh đại diện', 
        points: 20, 
        completed: !!user.avatar, 
        category: 'profile',
        requiresPurchase: false,
        icon: 'User',
        hint: 'Thêm ảnh để cá nhân hóa tài khoản'
      },
      { 
        key: 'cart', 
        label: 'Thêm sản phẩm vào giỏ hàng', 
        points: 20, 
        completed: cartItems.length > 0, 
        category: 'shopping',
        requiresPurchase: false,
        icon: 'ShoppingCart',
        hint: 'Khám phá và thêm sản phẩm yêu thích vào giỏ hàng'
      },
      { 
        key: 'review', 
        label: 'Đánh giá sản phẩm', 
        points: 20, 
        completed: reviews.length > 0, 
        category: 'engagement',
        requiresPurchase: true,
        icon: 'Star',
        hint: '⭐ Phải mua sản phẩm trước khi đánh giá được!'
      },
      { 
        key: 'share', 
        label: 'Chia sẻ 1 sản phẩm', 
        points: 20, 
        completed: productShares.length > 0, 
        category: 'engagement',
        requiresPurchase: false,
        icon: 'Heart',
        hint: 'Chia sẻ sản phẩm hay với bạn bè'
      },
      { 
        key: 'gitcode', 
        label: 'Nhập 1 GitCode', 
        points: 20, 
        completed: gitCodeUsages.length > 0, 
        category: 'special',
        requiresPurchase: false,
        icon: 'Code',
        hint: 'Nhập mã GitCode để truy cập tài nguyên đặc biệt'
      }
    ];

    const allFields = [...focusedTasks];
    
    allFields.forEach(field => {
      if (field.completed) {
        totalPoints += field.points;
        achievements.push(field);
      }
    });

    const percentage = Math.min(Math.round((totalPoints / maxPoints) * 100), 100);
    const pendingFields = allFields.filter(f => !f.completed);

    // Determine tier
    let tier = 'Bronze';
    let tierColor = '#CD7F32';
    let nextTierThreshold = 40;
    let tierBenefits = ['Giảm giá cơ bản', 'Hỗ trợ email'];

    if (percentage >= 80) {
      tier = 'Diamond';
      tierColor = '#B9F2FF';
      nextTierThreshold = 100;
      tierBenefits = ['Giảm giá VIP 20%', 'Hỗ trợ ưu tiên', 'Sản phẩm độc quyền', 'Free shipping', 'Beta access'];
    } else if (percentage >= 60) {
      tier = 'Gold';
      tierColor = '#FFD700';
      nextTierThreshold = 80;
      tierBenefits = ['Giảm giá 15%', 'Hỗ trợ ưu tiên', 'Early access'];
    } else if (percentage >= 40) {
      tier = 'Silver';
      tierColor = '#C0C0C0';
      nextTierThreshold = 60;
      tierBenefits = ['Giảm giá 10%', 'Newsletter độc quyền'];
    }

    // Calculate potential rewards
    const potentialRewards = [];
    if (percentage >= 100) {
      potentialRewards.push({
        type: 'coupon',
        code: 'VIP_MEMBER_20',
        discount: 20,
        description: 'Mã giảm giá VIP 20% cho thành viên hoàn hảo'
      });
    }

    const progressData = {
      percentage,
      totalPoints,
      maxPoints,
      achievements: achievements.map(a => ({
        ...a,
        completedAt: new Date().toISOString()
      })),
      pendingFields,
      tier: {
        current: tier,
        color: tierColor,
        benefits: tierBenefits,
        nextTier: tier === 'Diamond' ? null : (
          tier === 'Gold' ? 'Diamond' :
          tier === 'Silver' ? 'Gold' : 'Silver'
        ),
        nextTierThreshold,
        progressToNext: percentage >= 80 ? 0 : Math.max(0, nextTierThreshold - percentage)
      },
      stats: {
        reviews: reviews.length,
        cartItems: cartItems.length,
        productShares: productShares.length,
        gitCodeUsages: gitCodeUsages.length,
        memberSince: user.createdAt
      },
      potentialRewards,
      recommendations: pendingFields
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
        .map(field => ({
          ...field,
          priority: field.points >= 15 ? 'high' : field.points >= 10 ? 'medium' : 'low'
        }))
    };

    return NextResponse.json({
      success: true,
      data: progressData
    });

  } catch (error) {
    console.error('Error in account progress API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
