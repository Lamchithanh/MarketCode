import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';
import { EmailService } from '@/lib/email-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: {
      quoted_price: number;
      quoted_duration: string;
      quote_notes: string;
      admin_email?: string;
    } = await request.json();

    // Validate required fields
    if (!body.quoted_price || !body.quoted_duration) {
      return NextResponse.json(
        { error: 'Quoted price and duration are required' },
        { status: 400 }
      );
    }

    // Get service request details
    const { data: serviceRequest, error: fetchError } = await supabaseServiceRole
      .from('ServiceRequest')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !serviceRequest) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      );
    }

    // Update service request with quote and mark as quoted
    const updateData = {
      quoted_price: body.quoted_price,
      quoted_duration: body.quoted_duration,
      quote_notes: body.quote_notes,
      quoted_at: new Date().toISOString(),
      status: 'quoted', // Mark as quoted after sending quote
      // updated_at handled by trigger
    };

    const { error: updateError } = await supabaseServiceRole
      .from('ServiceRequest')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Error updating service request:', updateError);
      return NextResponse.json(
        { error: 'Failed to save quote' },
        { status: 500 }
      );
    }

    // Send quote email to customer
    const emailSent = await sendQuoteEmail({
      to: serviceRequest.email,
      customerName: serviceRequest.name,
      serviceName: serviceRequest.service_name,
      serviceTitle: serviceRequest.title,
      quotedPrice: body.quoted_price,
      quotedDuration: body.quoted_duration,
      quoteNotes: body.quote_notes,
      adminEmail: body.admin_email || 'support@marketcode.com',
    });

    if (!emailSent) {
      console.error('Failed to send quote email');
      return NextResponse.json(
        { error: 'Quote saved but failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Quote sent successfully',
      status: 'quoted'
    });

  } catch (error) {
    console.error('Quote sending error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Email template for sending quotes
async function sendQuoteEmail(params: {
  to: string;
  customerName: string;
  serviceName: string;
  serviceTitle: string;
  quotedPrice: number;
  quotedDuration: string;
  quoteNotes: string;
  adminEmail: string;
}) {
  try {
    const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Báo giá dịch vụ - MarketCode</h2>
      
      <p>Xin chào <strong>${params.customerName}</strong>,</p>
      
      <p>Chúng tôi đã xem xét yêu cầu dịch vụ của bạn và có báo giá như sau:</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Chi tiết dịch vụ:</h3>
        <p><strong>Loại dịch vụ:</strong> ${params.serviceName}</p>
        <p><strong>Tiêu đề:</strong> ${params.serviceTitle}</p>
        <p><strong>Giá ước tính:</strong> <span style="color: #059669; font-weight: bold;">${params.quotedPrice.toLocaleString()} VND</span></p>
        <p><strong>Thời gian thực hiện:</strong> ${params.quotedDuration}</p>
      </div>
      
      ${params.quoteNotes ? `
        <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #92400e;">Ghi chú thêm:</h4>
          <p style="margin-bottom: 0;">${params.quoteNotes}</p>
        </div>
      ` : ''}
      
      <p>Nếu bạn đồng ý với báo giá này, vui lòng phản hồi email hoặc liên hệ với chúng tôi để tiến hành bước tiếp theo.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p>Trân trọng,<br>
      <strong>Đội ngũ MarketCode</strong><br>
      Email: ${params.adminEmail}<br>
      Website: <a href="https://marketcode.com">marketcode.com</a></p>
    </div>
    `;

    const result = await EmailService.sendEmail(
      params.to,
      {
        subject: `Báo giá dịch vụ: ${params.serviceTitle}`,
        html: emailTemplate
      }
    );
    
    return result.success;
    
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}