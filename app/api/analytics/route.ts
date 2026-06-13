import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Subscriber from "@/models/Subscriber";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";

/** GET /api/analytics — admin only */
export async function GET() {
  try {
    const token   = await getTokenFromCookies();
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [totalProducts, totalCategories, totalSubscribers, featuredProducts] =
      await Promise.all([
        Product.countDocuments(),
        Category.countDocuments(),
        Subscriber.countDocuments(),
        Product.countDocuments({ featured: true }),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalSubscribers,
        featuredProducts,
      },
    });
  } catch (err) {
    console.error("[GET /api/analytics]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
