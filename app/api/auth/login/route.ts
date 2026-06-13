import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { signToken, buildCookieHeader } from "@/lib/auth";
import { z } from "zod";

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

/** POST /api/auth/login */
export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password format" },
        { status: 400 }
      );
    }

    await dbConnect();
    const { email, password } = parsed.data;

    const user = await AdminUser.findOne({ email });
    if (!user) {
      // Generic message to prevent user enumeration
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signToken({
      id:    user._id.toString(),
      email: user.email,
      role:  user.role,
    });

    return NextResponse.json(
      { success: true, message: "Login successful", user: { name: user.name, email: user.email, role: user.role } },
      {
        status: 200,
        headers: { "Set-Cookie": buildCookieHeader(token) },
      }
    );
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
