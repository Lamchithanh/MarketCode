import { NextRequest, NextResponse } from 'next/server';

// Simple test endpoint
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[GET] Test endpoint called with ID:', params.id);
  
  return NextResponse.json({
    message: 'Test endpoint working',
    id: params.id,
    method: 'GET'
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[PUT] Test endpoint called with ID:', params.id);
  
  return NextResponse.json({
    message: 'Test endpoint working',
    id: params.id,
    method: 'PUT'
  });
}
