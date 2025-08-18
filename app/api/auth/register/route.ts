import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase-server";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedFields = registerSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu không hợp lệ",
          details: validatedFields.error.format(),
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password } = validatedFields.data;

    // Check if user already exists
    const { data: existingUser, error: findError } = await supabaseServiceRole
      .from('User')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser && !findError) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error: createError } = await supabaseServiceRole
      .from('User')
      .insert({
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        role: "USER",
        isActive: true,
      })
      .select()
      .single();

    if (createError) {
      console.error('Create user error:', createError);
      return NextResponse.json(
        { error: "Không thể tạo tài khoản" },
        { status: 500 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Tài khoản đã được tạo thành công",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo tài khoản" },
      { status: 500 }
    );
  }
}
