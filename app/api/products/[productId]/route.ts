import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.number().positive().optional(),
  comparePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  partNumber: z.string().optional(),
  condition: z.string().optional(),
  compatibility: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      include: {
        category: true,
        shop: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Ürün yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = productUpdateSchema.parse(body);

    // Verify product belongs to seller's shop
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    if (product.shopId !== session.user.shopId) {
      return NextResponse.json(
        { error: "Bu ürünü düzenleme yetkiniz yok" },
        { status: 403 }
      );
    }

    // Check SKU uniqueness if being updated
    if (validatedData.sku && validatedData.sku !== product.sku) {
      const skuExists = await prisma.product.findFirst({
        where: {
          sku: validatedData.sku,
          NOT: { id: params.productId },
        },
      });

      if (skuExists) {
        return NextResponse.json(
          { error: "Bu SKU zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: params.productId },
      data: validatedData,
    });

    return NextResponse.json({
      message: "Ürün başarıyla güncellendi",
      product: updatedProduct,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "Ürün güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    // Verify product belongs to seller's shop
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    if (product.shopId !== session.user.shopId) {
      return NextResponse.json(
        { error: "Bu ürünü silme yetkiniz yok" },
        { status: 403 }
      );
    }

    await prisma.product.delete({
      where: { id: params.productId },
    });

    return NextResponse.json({
      message: "Ürün başarıyla silindi",
    });
  } catch (error) {
    console.error("Product deletion error:", error);
    return NextResponse.json(
      { error: "Ürün silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
