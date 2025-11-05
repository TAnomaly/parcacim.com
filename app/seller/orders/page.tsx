import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag } from "lucide-react";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { OrderStatusUpdate } from "@/components/OrderStatusUpdate";

async function getShopOrders(shopId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { shopId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders;
  } catch (error) {
    console.error("Error fetching shop orders:", error);
    return [];
  }
}

export default async function SellerOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SELLER" || !session.user.shopId) {
    redirect("/login");
  }

  const orders = await getShopOrders(session.user.shopId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Siparişler</h1>
          <p className="text-gray-600">{orders.length} sipariş bulundu</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Henüz Sipariş Yok</h2>
            <p className="text-gray-600">
              Ürünleriniz satıldığında siparişler burada görünecek.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 border-b px-6 py-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Sipariş No</p>
                        <p className="font-semibold">{order.orderNumber}</p>
                      </div>
                      <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
                      <div>
                        <p className="text-sm text-gray-500">Tarih</p>
                        <p className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
                      <div>
                        <p className="text-sm text-gray-500">Müşteri</p>
                        <p className="font-medium">{order.customerName}</p>
                      </div>
                      <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
                      <div>
                        <p className="text-sm text-gray-500">Toplam</p>
                        <p className="font-bold text-blue-600">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order.status} />
                      <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Ürünler</h3>
                    <div className="space-y-3">
                      {order.items.map((item) => {
                        const images = item.product.images
                          ? JSON.parse(item.product.images)
                          : [];

                        return (
                          <div key={item.id} className="flex gap-4 border-b pb-3">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {images[0] ? (
                                <img
                                  src={images[0]}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{item.productName}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} adet × {formatPrice(item.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                    <div>
                      <h3 className="font-semibold mb-3">Müşteri Bilgileri</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Ad Soyad:</span>
                          <span className="ml-2 font-medium">{order.customerName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-medium">{order.customerEmail}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Telefon:</span>
                          <span className="ml-2 font-medium">{order.customerPhone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Teslimat Adresi</h3>
                      <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="border-t mt-6 pt-6">
                      <h3 className="font-semibold mb-2">Sipariş Notu</h3>
                      <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded p-3">
                        {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
