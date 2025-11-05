import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

async function getSellerStats(shopId: string) {
  try {
    const [productCount, orderCount, orders] = await Promise.all([
      prisma.product.count({ where: { shopId } }),
      prisma.order.count({ where: { shopId } }),
      prisma.order.findMany({
        where: { shopId },
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const lowStockProducts = await prisma.product.count({
      where: { shopId, stock: { lte: 5 } },
    });

    return {
      productCount,
      orderCount,
      totalRevenue,
      lowStockProducts,
      recentOrders: orders,
    };
  } catch (error) {
    console.error("Error fetching seller stats:", error);
    return {
      productCount: 0,
      orderCount: 0,
      totalRevenue: 0,
      lowStockProducts: 0,
      recentOrders: [],
    };
  }
}

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SELLER" || !session.user.shopId) {
    redirect("/login");
  }

  const shop = await prisma.shop.findUnique({
    where: { id: session.user.shopId },
  });

  if (!shop) {
    redirect("/seller/register");
  }

  const stats = await getSellerStats(shop.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Satıcı Paneli</h1>
          <p className="text-gray-600">{shop.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Toplam Ürün</p>
                <p className="text-3xl font-bold">{stats.productCount}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Toplam Sipariş</p>
                <p className="text-3xl font-bold">{stats.orderCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Toplam Gelir</p>
                <p className="text-3xl font-bold">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Düşük Stok</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.lowStockProducts}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/seller/products/new"
            className="bg-blue-600 text-white rounded-lg shadow-lg p-6 hover:bg-blue-700 transition-colors"
          >
            <Package className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Yeni Ürün Ekle</h3>
            <p className="text-blue-100">Mağazanıza yeni ürün ekleyin</p>
          </Link>

          <Link
            href="/seller/products"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <Package className="h-8 w-8 mb-3 text-gray-700" />
            <h3 className="text-xl font-semibold mb-2">Ürünlerim</h3>
            <p className="text-gray-600">Ürünlerinizi yönetin</p>
          </Link>

          <Link
            href="/seller/orders"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <ShoppingBag className="h-8 w-8 mb-3 text-gray-700" />
            <h3 className="text-xl font-semibold mb-2">Siparişler</h3>
            <p className="text-gray-600">Siparişlerinizi görüntüleyin</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Son Siparişler</h2>
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p>Henüz sipariş bulunmuyor</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Sipariş No</th>
                    <th className="text-left py-3 px-4">Müşteri</th>
                    <th className="text-left py-3 px-4">Tutar</th>
                    <th className="text-left py-3 px-4">Durum</th>
                    <th className="text-left py-3 px-4">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                      <td className="py-3 px-4">{order.customerName}</td>
                      <td className="py-3 px-4">{formatPrice(order.total)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
