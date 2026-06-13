import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

/** DELETE /api/categories/:id — admin only */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const token   = await getTokenFromCookies();
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const cat = await Category.findByIdAndDelete(id);

    if (!cat) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.error("[DELETE /api/categories/:id]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
