import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get system settings from database - we'll use MCP to query directly
    // This would typically use your database client, but for now we'll return the known values
    const systemSettings = {
      // Site Identity
      siteName: "MarketCodes", // From database: site_name
      logoUrl: "https://tpatqvqlfklagdkxeqpt.supabase.co/storage/v1/object/public/branding/logo_url/github.png", // From database: logo_url
      siteDescription: "Nền tảng uy tín cung cấp source code chất lượng cao cho React, NextJS và các công nghệ web hiện đại.",
      
      // Contact Information
      supportEmail: "support@marketcode.com",
      phoneNumber: "+84 123 456 789",
      address: "Hà Nội, Việt Nam",
      
      // Email Settings
      emailFromName: "MarketCode Team", // From database: email_from_name
      
      // Social Media Links
      facebookUrl: "https://facebook.com/marketcode",
      twitterUrl: "https://twitter.com/marketcode", 
      githubUrl: "https://github.com/marketcode",
      linkedinUrl: "https://linkedin.com/company/marketcode",
      
      // Footer Info
      copyrightText: "2024 MarketCodes. Tất cả quyền được bảo lưu.",
      companyName: "MarketCodes",
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
        siteDescription: "Nền tảng uy tín cung cấp source code chất lượng cao cho React, NextJS và các công nghệ web hiện đại.",
        supportEmail: "support@marketcode.com",
        phoneNumber: "+84 123 456 789",
        address: "Hà Nội, Việt Nam",
        emailFromName: "MarketCode Team",
        facebookUrl: "https://facebook.com/marketcode",
        twitterUrl: "https://twitter.com/marketcode",
        githubUrl: "https://github.com/marketcode",
        linkedinUrl: "https://linkedin.com/company/marketcode",
        copyrightText: "2024 MarketCode. Tất cả quyền được bảo lưu.",
        companyName: "MarketCode",
      },
      { status: 200 }
    );
  }
}
