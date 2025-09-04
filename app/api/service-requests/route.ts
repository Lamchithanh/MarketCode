import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';
import { EmailService } from '@/lib/email-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const service_type = searchParams.get('service_type') || '';
    const priority = searchParams.get('priority') || '';

    const offset = (page - 1) * limit;

    // Build query
    let query = supabaseServiceRole
      .from('ServiceRequest')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (service_type) {
      query = query.eq('service_type', service_type);
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: requests, error, count } = await query;

    if (error) {
      console.error('Error fetching service requests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch service requests' },
        { status: 500 }
      );
    }

    // Get statistics
    const { data: allRequests } = await supabaseServiceRole
      .from('ServiceRequest')
      .select('status, quoted_price, created_at');

    const statistics = {
      total: count || 0,
      pending: allRequests?.filter(r => r.status === 'pending').length || 0,
      reviewing: allRequests?.filter(r => r.status === 'reviewing').length || 0,
      quoted: allRequests?.filter(r => r.status === 'quoted').length || 0,
      approved: allRequests?.filter(r => r.status === 'approved').length || 0,
      in_progress: allRequests?.filter(r => r.status === 'in_progress').length || 0,
      completed: allRequests?.filter(r => r.status === 'completed').length || 0,
      cancelled: allRequests?.filter(r => r.status === 'cancelled').length || 0,
      this_week: allRequests?.filter(r => {
        const requestDate = new Date(r.created_at);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return requestDate >= oneWeekAgo;
      }).length || 0,
      total_revenue: allRequests?.reduce((sum, r) => {
        return r.status === 'completed' && r.quoted_price ? sum + Number(r.quoted_price) : sum;
      }, 0) || 0
    };

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      requests: requests || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages
      },
      statistics
    });

  } catch (error) {
    console.error('Service requests API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('=== SERVICE REQUEST API START ===');
    
    let body: {
      user_id?: string;
      name: string;
      email: string;
      phone?: string;
      company?: string;
      service_type: string;
      service_name: string;
      title: string;
      description: string;
      budget_range?: string;
      timeline?: string;
      priority?: string;
      requirements?: Record<string, unknown>;
      technical_specs?: Record<string, unknown>;
    };
    
    try {
      body = await req.json();
      console.log('Request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const {
      user_id,
      name,
      email,
      phone,
      company,
      service_type,
      service_name,
      title,
      description,
      budget_range,
      timeline,
      priority = 'medium',
      requirements = {},
      technical_specs = {}
    } = body;

    // Map Vietnamese service_type to English for constraint compatibility
    const serviceTypeMapping: Record<string, string> = {
      'phat-trien-du-an-theo-yeu-cau': 'custom-development',
      'chinh-sua-du-an-co-san': 'project-customization', 
      'maintenance': 'maintenance',
      'thiet-ke-lai-giao-dien': 'ui-redesign',
      'performance-optimization': 'performance-optimization',
      'consultation': 'consultation'
    };
    
    // Convert service_type if needed
    const mappedServiceType = serviceTypeMapping[service_type] || service_type;
    
    console.log('Original service_type:', service_type);
    console.log('Mapped service_type:', mappedServiceType);

    // Get service info if service_type is provided
    let finalServiceName = service_name;
    if (mappedServiceType && !service_name) {
      const { data: service } = await supabaseServiceRole
        .from('Service')
        .select('name')
        .eq('service_type', service_type) // Use original for Service table lookup
        .single();
      
      if (service) {
        finalServiceName = service.name;
      }
    }
    
    // Ensure we have a service name
    if (!finalServiceName) {
      finalServiceName = service_name || 'Unknown Service';
    }

    // Validate required fields
    console.log('Validating required fields...');
    if (!name || !email || !mappedServiceType || !service_name || !title || !description) {
      console.log('Validation failed - missing fields:', {
        name: !!name,
        email: !!email, 
        service_type: !!mappedServiceType,
        service_name: !!service_name,
        title: !!title,
        description: !!description
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Validation passed, inserting to database...');

    // Insert service request
    const insertData = {
      user_id,
      name,
      email,
      phone,
      company,
      service_type: mappedServiceType, // Use mapped service_type
      service_name: finalServiceName,
      title,
      description,
      budget_range,
      timeline,
      priority,
      requirements,
      technical_specs,
      status: 'pending'
    };
    
    console.log('Insert data:', JSON.stringify(insertData, null, 2));
    
    const { data: serviceRequest, error } = await supabaseServiceRole
      .from('ServiceRequest')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create service request', details: error.message },
        { status: 500 }
      );
    }

    console.log('Service request created successfully:', serviceRequest.id);

    // Send email notification to admin
    try {
      console.log('Attempting to send email notification...');
      
      // Get admin email from system settings
      const { data: settingsData } = await supabaseServiceRole
        .from('SystemSetting')
        .select('key, value')
        .in('key', ['contact_email', 'support_email', 'admin_email']);

      let adminEmail = 'admin@marketcode.vn';
      if (settingsData && settingsData.length > 0) {
        const emailSetting = settingsData.find(item => 
          item.key === 'contact_email' || 
          item.key === 'support_email' || 
          item.key === 'admin_email'
        );
        if (emailSetting?.value) {
          adminEmail = emailSetting.value;
        }
      }

      console.log('Admin email:', adminEmail);

      // Send notification email to admin
      const emailSubject = `Yêu cầu dịch vụ mới: ${title}`;
      const emailContent = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: #ffffff;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e5e5e5;">
            <h1 style="color: #333333; margin: 0; font-size: 24px; font-weight: 600;">MarketCode</h1>
            <p style="color: #666666; margin: 5px 0 0 0; font-size: 14px;">Thông báo yêu cầu dịch vụ mới</p>
          </div>
          
          <!-- Alert Badge -->
          <div style="background: #8b4513; color: #ffffff; padding: 12px 20px; border-radius: 6px; text-align: center; margin-bottom: 24px; font-weight: 500; font-size: 14px;">
            Yêu cầu dịch vụ mới cần xử lý
          </div>
          
          <!-- Main Content -->
          <div style="background: #f5f5f5; padding: 24px; border-radius: 8px; border: 1px solid #e5e5e5; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <div style="width: 8px; height: 8px; background: #8b4513; border-radius: 50%; margin-right: 12px;"></div>
              <h2 style="color: #333333; margin: 0; font-size: 18px; font-weight: 600;">Chi tiết yêu cầu dịch vụ</h2>
            </div>
            <p style="color: #666666; margin: 0; font-size: 14px; line-height: 1.5;">Khách hàng ${name} đã gửi yêu cầu dịch vụ mới cần được xem xét.</p>
          </div>

          <!-- Request Information -->
          <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e5e5; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <div style="width: 6px; height: 6px; background: #8b4513; border-radius: 50%; margin-right: 8px;"></div>
              <h3 style="color: #333333; margin: 0; font-size: 16px; font-weight: 600;">Thông tin yêu cầu</h3>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666666; font-weight: 500; width: 120px;">ID:</td><td style="padding: 8px 0; color: #333333; font-family: monospace; font-size: 13px;">${serviceRequest.id}</td></tr>
              <tr><td style="padding: 8px 0; color: #666666; font-weight: 500;">Tiêu đề:</td><td style="padding: 8px 0; color: #333333; font-weight: 600;">${title}</td></tr>
              <tr><td style="padding: 8px 0; color: #666666; font-weight: 500;">Dịch vụ:</td><td style="padding: 8px 0; color: #333333;">${finalServiceName}</td></tr>
              <tr><td style="padding: 8px 0; color: #666666; font-weight: 500;">Loại:</td><td style="padding: 8px 0;"><span style="background: #f5f5f5; color: #333333; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">${mappedServiceType}</span></td></tr>
              <tr><td style="padding: 8px 0; color: #666666; font-weight: 500;">Ưu tiên:</td><td style="padding: 8px 0;"><span style="background: ${priority === 'high' ? '#f5f5f5' : priority === 'medium' ? '#f5f5f5' : '#f5f5f5'}; color: #333333; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">${priority}</span></td></tr>
              <tr><td style="padding: 8px 0; color: #666666; font-weight: 500;">Ngân sách:</td><td style="padding: 8px 0; color: #333333;">${budget_range || 'Chưa xác định'}</td></tr>
              <tr><td style="padding: 8px 0; color: #666666; font-weight: 500;">Thời gian:</td><td style="padding: 8px 0; color: #333333;">${timeline || 'Chưa xác định'}</td></tr>
            </table>
          </div>

          <!-- Customer Information -->
          <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e5e5; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <div style="width: 6px; height: 6px; background: #8b4513; border-radius: 50%; margin-right: 8px;"></div>
              <h3 style="color: #333333; margin: 0; font-size: 16px; font-weight: 600;">Thông tin khách hàng</h3>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666666; font-weight: 500; width: 120px;">Tên:</td><td style="padding: 8px 0; color: #333333; font-weight: 600;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #666666; font-weight: 500;">Email:</td><td style="padding: 8px 0; color: #8b4513;">${email}</td></tr>
              <tr><td style="padding: 8px 0; color: #666666; font-weight: 500;">Điện thoại:</td><td style="padding: 8px 0; color: #333333;">${phone || 'Không có'}</td></tr>
              <tr><td style="padding: 8px 0; color: #666666; font-weight: 500;">Công ty:</td><td style="padding: 8px 0; color: #333333;">${company || 'Không có'}</td></tr>
            </table>
          </div>

          <!-- Description -->
          <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e5e5; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <div style="width: 6px; height: 6px; background: #8b4513; border-radius: 50%; margin-right: 8px;"></div>
              <h3 style="color: #333333; margin: 0; font-size: 16px; font-weight: 600;">Mô tả chi tiết</h3>
            </div>
            <div style="color: #333333; line-height: 1.6; white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 6px; border-left: 3px solid #8b4513;">${description}</div>
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/service-requests" 
               style="background: #8b4513; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);">
              Xem chi tiết và xử lý
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
            <p style="color: #666666; font-size: 12px; margin: 0;">
              Email được gửi tự động từ hệ thống MarketCode<br>
              ${new Date().toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      `;

      await EmailService.sendEmail(
        adminEmail,
        {
          subject: emailSubject,
          html: emailContent
        }
      );

      console.log('Email notification sent successfully');

    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if email fails - just log it
    }

    return NextResponse.json({
      request: serviceRequest,
      message: 'Service request created successfully'
    });

  } catch (error) {
    console.error('Service request creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
