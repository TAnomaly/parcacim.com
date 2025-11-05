import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(3, "Ürün adı en az 3 karakter olmalıdır"),
  description: z.string().optional(),
  categoryId: z.string(),
  price: z.number().positive("Fiyat pozitif olmalıdır"),
  comparePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0, "Stok negatif olamaz"),
  sku: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  partNumber: z.string().optional(),
  condition: z.string().optional(),
  compatibility: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SELLER" || !session.user.shopId) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = productSchema.parse(body);

    // Generate slug
    let slug = generateSlug(validatedData.name);
    let slugExists = await prisma.product.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${generateSlug(validatedData.name)}-${counter}`;
      slugExists = await prisma.product.findUnique({ where: { slug } });
      counter++;
    }

    // Check if SKU already exists
    if (validatedData.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku: validatedData.sku },
      });
      if (skuExists) {
        return NextResponse.json(
          { error: "Bu SKU zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug,
        shopId: session.user.shopId,
        comparePrice: validatedData.comparePrice || null,
      },
    });

    return NextResponse.json({ message: "Ürün başarıyla eklendi", product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Ürün eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
