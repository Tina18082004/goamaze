import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { z } from "zod";

const UpdateSchema = z.object({
  title:         z.string().min(2).max(200).optional(),
  subtitle:      z.string().min(2).max(400).optional(),
  description:   z.string().optional(),
  price:         z.string().min(1).optional(),
  originalPrice: z.string().min(1).optional(),
  category:      z.string().min(1).optional(),
  image:         z.string().url().optional(),
  affiliateLink: z.string().url().optional(),
  badge:         z.string().optional(),
  rating:        z.number().min(0).max(5).optional(),
  reviews:       z.number().min(0).optional(),
  featured:      z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

/** GET /api/products/:id — public */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await dbConnect();
    const { id } = await params;
    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    console.error("[GET /api/products/:id]", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/** PUT /api/products/:id — admin only */
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const token   = await getTokenFromCookies();
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;
    const body   = await req.json();

    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(id, parsed.data, {
      new:          true,
      runValidators: true,
    }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    console.error("[PUT /api/products/:id]", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/:id — admin only
 *
 * 1. Finds the product to retrieve its Cloudinary public_id (stored as the
 *    "image" field when the URL matches res.cloudinary.com).
 * 2. Deletes the DB record.
 * 3. Attempts to remove the asset from Cloudinary CDN (non-fatal if it fails).
 */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const token   = await getTokenFromCookies();
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;

    // Fetch first so we can get the image URL before deletion
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Extract Cloudinary public_id from the image URL if it's a Cloudinary asset.
    // Cloudinary URLs look like:
    //   https://res.cloudinary.com/<cloud_name>/image/upload/v<ver>/<public_id>.<ext>
    const imageUrl = product.image as string;
    let cloudinaryPublicId: string | null = null;

    if (imageUrl && imageUrl.includes("res.cloudinary.com")) {
      try {
        // Grab everything after "/upload/" and strip version segment + extension
        const afterUpload = imageUrl.split("/upload/")[1] ?? "";
        // Remove optional version prefix like "v1234567890/"
        const withoutVersion = afterUpload.replace(/^v\d+\//, "");
        // Remove file extension
        cloudinaryPublicId = withoutVersion.replace(/\.[^/.]+$/, "");
      } catch {
        // Parsing failed — skip Cloudinary deletion
        cloudinaryPublicId = null;
      }
    }

    // Delete from MongoDB
    await product.deleteOne();

    // Delete from Cloudinary (non-blocking, non-fatal)
    if (cloudinaryPublicId) {
      await deleteFromCloudinary(cloudinaryPublicId).catch((e) =>
        console.error("[DELETE /api/products/:id] Cloudinary cleanup failed:", e)
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted",
      cloudinaryCleanup: cloudinaryPublicId ? "attempted" : "skipped (not a Cloudinary URL)",
    });
  } catch (err) {
    console.error("[DELETE /api/products/:id]", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
