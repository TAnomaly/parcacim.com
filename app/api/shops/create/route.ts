import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const shopCreateSchema = z.object({
  shopName: z.string().min(2, "Mağaza adı en az 2 karakter olmalıdır"),
  shopDescription: z.string().optional(),
  shopPhone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  shopAddress: z.string().min(5, "Adres en az 5 karakter olmalıdır"),
  shopEmail: z.string().email("Geçerli bir email giriniz"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    // Check if user already has a shop
    const existingShop = await prisma.shop.findUnique({
      where: { ownerId: session.user.id },
    });

    if (existingShop) {
      return NextResponse.json(
        { error: "Zaten bir mağazanız var" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = shopCreateSchema.parse(body);

    // Generate shop slug
    let slug = generateSlug(validatedData.shopName);
    let slugExists = await prisma.shop.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${generateSlug(validatedData.shopName)}-${counter}`;
      slugExists = await prisma.shop.findUnique({ where: { slug } });
      counter++;
    }

    // Create shop and update user role in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const shop = await tx.shop.create({
        data: {
          name: validatedData.shopName,
          slug,
          description: validatedData.shopDescription,
          phone: validatedData.shopPhone,
          address: validatedData.shopAddress,
          email: validatedData.shopEmail,
          ownerId: session.user.id,
        },
      });

      // Update user role to SELLER
      await tx.user.update({
        where: { id: session.user.id },
        data: { role: "SELLER" },
      });

      return shop;
    });

    return NextResponse.json({
      message: "Mağaza başarıyla oluşturuldu",
      shop: {
        id: result.id,
        name: result.name,
        slug: result.slug,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Shop creation error:", error);
    return NextResponse.json(
      { error: "Mağaza oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
