import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().optional(),
});

/** GET /api/categories — public */
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, data: categories });
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/** POST /api/categories — admin only */
export async function POST(req: NextRequest) {
  try {
    const token   = await getTokenFromCookies();
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body   = await req.json();
    const parsed = CategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const slug = parsed.data.name.toLowerCase().replace(/\s+/g, "-");
    const category = await Category.create({ ...parsed.data, slug });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 409 }
      );
    }
    console.error("[POST /api/categories]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
