import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";

async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shop: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

const statusConfig = {
  PENDING: {
    label: "Beklemede",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  PROCESSING: {
    label: "Hazırlanıyor",
    icon: Package,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  SHIPPED: {
    label: "Kargoda",
    icon: Truck,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  DELIVERED: {
    label: "Teslim Edildi",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  CANCELLED: {
    label: "İptal Edildi",
    icon: XCircle,
    color: "bg-red-100 text-red-800 border-red-200",
  },
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Siparişlerim</h1>
          <p className="text-gray-600">Tüm siparişlerinizi buradan takip edebilirsiniz</p>
        </div>

        {/* Success Message */}
        {searchParams.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
            <CheckCircle className="h-6 w-6" />
            <div>
              <p className="font-semibold">Siparişiniz başarıyla oluşturuldu!</p>
              <p className="text-sm">Sipariş durumunuzu aşağıdan takip edebilirsiniz.</p>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Henüz Siparişiniz Yok</h2>
            <p className="text-gray-600 mb-8">
              İlk siparişinizi oluşturmak için alışverişe başlayın!
            </p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 border-b px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Sipariş No</p>
                          <p className="font-semibold">{order.orderNumber}</p>
                        </div>
                        <div className="h-8 w-px bg-gray-300"></div>
                        <div>
                          <p className="text-sm text-gray-500">Tarih</p>
                          <p className="font-medium">
                            {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                        <div className="h-8 w-px bg-gray-300"></div>
                        <div>
                          <p className="text-sm text-gray-500">Toplam</p>
                          <p className="font-bold text-blue-600">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border ${status.color}`}
                      >
                        <StatusIcon className="h-5 w-5" />
                        <span className="font-semibold">{status.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-6">
                    {/* Shop Info */}
                    <div className="mb-4 flex items-center gap-2 text-gray-700">
                      <Package className="h-5 w-5" />
                      <span className="font-medium">{order.shop.name}</span>
                    </div>

                    {/* Items */}
                    <div className="space-y-4 mb-6">
                      {order.items.map((item) => {
                        const images = item.product.images
                          ? JSON.parse(item.product.images)
                          : [];

                        return (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {images[0] ? (
                                <img
                                  src={images[0]}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <Link
                                href={`/products/${item.product.slug}`}
                                className="font-semibold hover:text-blue-600"
                              >
                                {item.productName}
                              </Link>
                              <p className="text-sm text-gray-600 mt-1">
                                Adet: {item.quantity} × {formatPrice(item.price)}
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

                    {/* Shipping Address */}
                    <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Teslimat Adresi:</p>
                        <p className="text-gray-900">{order.shippingAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">İletişim:</p>
                        <p className="text-gray-900">{order.customerName}</p>
                        <p className="text-gray-900">{order.customerPhone}</p>
                      </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="border-t mt-4 pt-4 text-sm">
                        <p className="text-gray-600 mb-1">Sipariş Notu:</p>
                        <p className="text-gray-900">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
