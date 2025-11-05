import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
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
    const { status } = statusSchema.parse(body);

    // Verify the order belongs to the seller's shop
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: { shop: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Sipariş bulunamadı" },
        { status: 404 }
      );
    }

    if (order.shopId !== session.user.shopId) {
      return NextResponse.json(
        { error: "Bu siparişi güncelleme yetkiniz yok" },
        { status: 403 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: params.orderId },
      data: { status },
    });

    return NextResponse.json({
      message: "Sipariş durumu güncellendi",
      order: updatedOrder,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Durum güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
