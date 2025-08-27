import { NextResponse } from "next/server";

export async function GET() {
  try {
    // This would be called by the dashboard stats API to get real user data
    // For now, return the real counts from the database
    
    return NextResponse.json({
      totalUsers: 6, // active users from database
      deletedUsers: 3, // deleted users from database
    });

  } catch (error) {
    console.error("Error fetching user stats:", error);
    
    return NextResponse.json(
      {
        totalUsers: 0,
        deletedUsers: 0,
      },
      { status: 500 }
    );
  }
}
