import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  Car,
  Wrench,
  ShoppingBag,
  TrendingUp,
  Store,
  Shield,
  Truck,
  CreditCard
} from "lucide-react";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        shop: true,
        category: true,
      },
      take: 8,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      take: 8,
      orderBy: {
        name: 'asc',
      },
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Arabanız İçin Her Parça Burada!
            </h1>
            <p className="text-xl mb-8">
              Türkiye'nin en büyük araba yedek parça pazaryerinde binlerce mağaza ve milyonlarca ürün sizi bekliyor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 text-center"
              >
                Ürünleri İncele
              </Link>
              <Link
                href="/seller/register"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 text-center"
              >
                Satıcı Ol
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Güvenli Alışveriş</h3>
              <p className="text-gray-600 text-sm">
                Onaylı satıcılar ve güvenli ödeme sistemi
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Hızlı Kargo</h3>
              <p className="text-gray-600 text-sm">
                Türkiye'nin her yerine hızlı teslimat
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Binlerce Mağaza</h3>
              <p className="text-gray-600 text-sm">
                Geniş satıcı ağımızla en iyi fiyatlar
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Kolay Ödeme</h3>
              <p className="text-gray-600 text-sm">
                Taksit seçenekleri ve güvenli ödeme
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-4xl mb-2">{category.icon || '🔧'}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Öne Çıkan Ürünler</h2>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Tümünü Gör →
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                Henüz öne çıkan ürün bulunmuyor.
              </p>
              <Link
                href="/seller/register"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800"
              >
                İlk satıcı siz olun →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    {product.images ? (
                      <img
                        src={JSON.parse(product.images)[0] || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Car className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{product.shop.name}</p>
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.stock > 0 ? (
                        <span className="text-sm text-green-600">Stokta</span>
                      ) : (
                        <span className="text-sm text-red-600">Tükendi</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Kendi Mağazanızı Açın!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Milyonlarca müşteriye ulaşın. Ücretsiz mağaza açın ve satışa başlayın.
          </p>
          <Link
            href="/seller/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Hemen Başla
          </Link>
        </div>
      </section>
    </div>
  );
}
