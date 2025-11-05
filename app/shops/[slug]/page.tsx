import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Store, MapPin, Phone, Mail, Package } from "lucide-react";
import Link from "next/link";

async function getShop(slug: string) {
  try {
    const shop = await prisma.shop.findUnique({
      where: { slug, isActive: true },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 12,
        },
        _count: {
          select: {
            products: { where: { isActive: true } },
            orders: true,
          },
        },
      },
    });
    return shop;
  } catch (error) {
    return null;
  }
}

export default async function ShopDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const shop = await getShop(params.slug);

  if (!shop) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Logo */}
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              {shop.logo ? (
                <img
                  src={shop.logo}
                  alt={shop.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Store className="h-12 w-12 text-blue-600" />
              )}
            </div>

            {/* Shop Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
              {shop.description && (
                <p className="text-blue-100 mb-4">{shop.description}</p>
              )}

              <div className="flex flex-wrap gap-6 text-sm">
                {shop.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{shop.address}</span>
                  </div>
                )}
                {shop.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${shop.phone}`} className="hover:underline">
                      {shop.phone}
                    </a>
                  </div>
                )}
                {shop.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${shop.email}`} className="hover:underline">
                      {shop.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{shop._count.products}</div>
                <div className="text-sm text-blue-100">Ürün</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{shop._count.orders}</div>
                <div className="text-sm text-blue-100">Sipariş</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Products */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Mağaza Ürünleri</h2>
          {shop._count.products > 12 && (
            <Link
              href={`/products?shop=${shop.slug}`}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Tümünü Gör ({shop._count.products} ürün)
            </Link>
          )}
        </div>

        {shop.products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Henüz Ürün Yok</h3>
            <p className="text-gray-600">Bu mağazada henüz ürün bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shop.products.map((product) => {
              const images = product.images ? JSON.parse(product.images) : [];

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-2 text-sm">
                      {product.name}
                    </h3>
                    {product.brand && (
                      <p className="text-xs text-gray-500 mb-2">
                        {product.brand} {product.model && `- ${product.model}`}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-600">Stokta</span>
                      ) : (
                        <span className="text-xs text-red-600">Tükendi</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
