import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get system settings from database - we'll use MCP to query directly
    // This would typically use your database client, but for now we'll return the known values
    const systemSettings = {
      siteName: "MarketCodes", // From database: site_name
      logoUrl: "https://tpatqvqlfklagdkxeqpt.supabase.co/storage/v1/object/public/branding/logo_url/github.png", // From database: logo_url
      emailFromName: "MarketCode Team", // From database: email_from_name
    };

    return NextResponse.json(systemSettings, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error("Error fetching system settings:", error);
    
    // Return fallback settings
    return NextResponse.json(
      {
        siteName: "MarketCode",
        logoUrl: "",
        emailFromName: "MarketCode Team",
      },
      { status: 200 }
    );
  }
}
