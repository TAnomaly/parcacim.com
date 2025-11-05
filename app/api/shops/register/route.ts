import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateSlug } from "@/lib/utils";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const sellerRegisterSchema = z.object({
  // User info
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  address: z.string().min(5, "Adres en az 5 karakter olmalıdır"),

  // Shop info
  shopName: z.string().min(2, "Mağaza adı en az 2 karakter olmalıdır"),
  shopDescription: z.string().optional(),
  shopPhone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  shopAddress: z.string().min(5, "Adres en az 5 karakter olmalıdır"),
  shopEmail: z.string().email("Geçerli bir email giriniz"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = sellerRegisterSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Generate shop slug
    let slug = generateSlug(validatedData.shopName);
    let slugExists = await prisma.shop.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${generateSlug(validatedData.shopName)}-${counter}`;
      slugExists = await prisma.shop.findUnique({ where: { slug } });
      counter++;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user and shop in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          phone: validatedData.phone,
          address: validatedData.address,
          role: "SELLER",
        },
      });

      const shop = await tx.shop.create({
        data: {
          name: validatedData.shopName,
          slug,
          description: validatedData.shopDescription,
          phone: validatedData.shopPhone,
          address: validatedData.shopAddress,
          email: validatedData.shopEmail,
          ownerId: user.id,
        },
      });

      return { user, shop };
    });

    return NextResponse.json({
      message: "Mağaza başarıyla oluşturuldu",
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      shop: {
        id: result.shop.id,
        name: result.shop.name,
        slug: result.shop.slug,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Seller registration error:", error);
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
