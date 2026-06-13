import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import { z } from "zod";

const ProductSchema = z.object({
  title:         z.string().min(2).max(200),
  subtitle:      z.string().min(2).max(400),
  description:   z.string().optional(),
  price:         z.string().min(1),
  originalPrice: z.string().min(1),
  category:      z.string().min(1),
  image:         z.string().url(),
  affiliateLink: z.string().url(),
  badge:         z.string().optional(),
  rating:        z.number().min(0).max(5).optional(),
  reviews:       z.number().min(0).optional(),
  featured:      z.boolean().optional(),
});

/** GET /api/products  — public */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search   = searchParams.get("search");
    const featured = searchParams.get("featured");
    const limit    = parseInt(searchParams.get("limit") || "100");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (category && category !== "All") query.category = category;
    if (featured === "true")            query.featured = true;
    if (search) {
      query.$or = [
        { title:    { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { badge:    { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/** POST /api/products — admin only */
export async function POST(req: NextRequest) {
  try {
    // Auth check
    const token   = await getTokenFromCookies();
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await Product.create(parsed.data);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/products]", err);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}
