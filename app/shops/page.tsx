import { prisma } from "@/lib/prisma";
import { Store, Package } from "lucide-react";
import Link from "next/link";

async function getAllShops() {
  try {
    const shops = await prisma.shop.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            products: { where: { isActive: true } },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return shops;
  } catch (error) {
    console.error("Error fetching shops:", error);
    return [];
  }
}

export default async function ShopsPage() {
  const shops = await getAllShops();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mağazalar</h1>
          <p className="text-gray-600">
            Platformumuzdaki tüm mağazaları keşfedin
          </p>
        </div>

        {shops.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Store className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Henüz Mağaza Yok</h2>
            <p className="text-gray-600 mb-8">
              İlk mağaza sahibi siz olun!
            </p>
            <Link
              href="/seller/register"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Mağaza Aç
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <Link
                key={shop.id}
                href={`/shops/${shop.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                  {shop.logo ? (
                    <img
                      src={shop.logo}
                      alt={shop.name}
                      className="w-20 h-20 rounded-full bg-white object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                      <Store className="h-10 w-10 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{shop.name}</h3>
                  {shop.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {shop.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Package className="h-4 w-4" />
                    <span>{shop._count.products} ürün</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
