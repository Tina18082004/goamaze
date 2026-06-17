import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import AdminUser from "@/models/AdminUser";
import productsData from "@/data/products.json";

/**
 * GET /api/seed?secret=YOUR_JWT_SECRET
 * — Safe way to trigger seed from browser or curl without needing POST.
 * Requires ?secret= query param matching JWT_SECRET for basic protection.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (!secret || secret !== process.env.JWT_SECRET) {
    return NextResponse.json(
      { success: false, message: "Unauthorized — pass ?secret=YOUR_JWT_SECRET" },
      { status: 401 }
    );
  }

  return runSeed();
}

/**
 * POST /api/seed
 * — Original POST handler kept for programmatic use.
 * Works in both dev AND production (protected by JWT_SECRET check).
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.JWT_SECRET}`) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  return runSeed();
}

async function runSeed() {
  try {
    await dbConnect();
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Database connection failed", error: String(err) },
      { status: 500 }
    );
  }

  const results: Record<string, unknown> = {};

  // ── 1. Seed categories ────────────────────────────────────────────────────
  const categoryNames = [
    { name: "Home Decor",    icon: "🏠" },
    { name: "Lifestyle",     icon: "✨" },
    { name: "Kitchen",       icon: "🍳" },
    { name: "Books",         icon: "📚" },
    { name: "Entertainment", icon: "🎮" },
  ];

  let catCount = 0;
  for (const cat of categoryNames) {
    const slug   = cat.name.toLowerCase().replace(/\s+/g, "-");
    const exists = await Category.findOne({ slug });
    if (!exists) {
      await Category.create({ ...cat, slug });
      catCount++;
    }
  }
  results.categoriesSeeded = catCount;

  // ── 2. Seed products from data/products.json ──────────────────────────────
  const existingCount = await Product.countDocuments();
  if (existingCount === 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped = (productsData as any[]).map((p) => ({
      title:         p.title,
      subtitle:      p.subtitle || p.description || "",
      price:         p.price,
      originalPrice: p.originalPrice || p.price,
      category:      p.category,
      image:         p.image,
      affiliateLink: p.affiliateLink,
      badge:         p.badge || "New",
      rating:        p.rating  ?? 4.5,
      reviews:       p.reviews ?? 0,
      featured:      false,
    }));

    await Product.insertMany(mapped);
    results.productsSeeded = mapped.length;
  } else {
    results.productsSeeded = 0;
    results.productsNote   = `${existingCount} products already exist — skipped.`;
  }

  // ── 3. Seed admin user ────────────────────────────────────────────────────
  const adminEmail    = process.env.ADMIN_EMAIL || "admin@goamaze.com";
  const existingAdmin = await AdminUser.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await AdminUser.create({
      name:     process.env.ADMIN_NAME     || "GoAmaze Admin",
      email:    adminEmail,
      password: process.env.ADMIN_PASSWORD || "GoAmaze@2024!",
      role:     "superadmin",
    });
    results.adminCreated = true;
  } else {
    results.adminCreated = false;
    results.adminNote    = "Admin user already exists.";
  }

  return NextResponse.json({ success: true, results });
}
