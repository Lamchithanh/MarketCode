import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    const serviceRequestData = {
      name: "Test User",
      email: "test@example.com",
      phone: "0123456789",
      company: "Test Company",
      service_type: "custom-development",
      service_name: "Phát triển ứng dụng tùy chỉnh",
      title: "Yêu cầu phát triển website thương mại điện tử",
      description: "Tôi cần phát triển một website thương mại điện tử hoàn chỉnh với các tính năng: quản lý sản phẩm, giỏ hàng, thanh toán online, quản lý đơn hàng.",
      budget_range: "10-20 triệu VNĐ",
      timeline: "2-3 tháng",
      priority: "medium",
      requirements: {
        test: true,
        created_via: 'api_test'
      }
    };

    const response = await fetch('http://localhost:3000/api/service-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceRequestData),
    });

    const result = await response.json();
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data: result
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to create a test service request",
    endpoint: "/api/test-service-request"
  });
}
