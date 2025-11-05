import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Car, Filter } from "lucide-react";

interface SearchParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}

async function getProducts(params: SearchParams) {
  try {
    const where: any = {
      isActive: true,
    };

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { brand: { contains: params.search, mode: 'insensitive' } },
        { model: { contains: params.search, mode: 'insensitive' } },
        { partNumber: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.category) {
      const category = await prisma.category.findUnique({
        where: { slug: params.category },
      });
      if (category) {
        where.categoryId = category.id;
      }
    }

    if (params.brand) {
      where.brand = { contains: params.brand, mode: 'insensitive' };
    }

    if (params.minPrice || params.maxPrice) {
      where.price = {};
      if (params.minPrice) where.price.gte = parseFloat(params.minPrice);
      if (params.maxPrice) where.price.lte = parseFloat(params.maxPrice);
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        shop: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const products = await getProducts(searchParams);
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Filtrele</h2>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Kategoriler</h3>
                <div className="space-y-2">
                  <Link
                    href="/products"
                    className={`block text-sm hover:text-blue-600 ${
                      !searchParams.category ? 'text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    Tümü
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className={`block text-sm hover:text-blue-600 ${
                        searchParams.category === category.slug
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3">Fiyat Aralığı</h3>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    defaultValue={searchParams.minPrice}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    defaultValue={searchParams.maxPrice}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {searchParams.search
                  ? `"${searchParams.search}" için arama sonuçları`
                  : 'Tüm Ürünler'}
              </h1>
              <p className="text-gray-600">{products.length} ürün bulundu</p>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Ürün bulunamadı</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
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
                      <p className="text-xs text-gray-500 mb-1">{product.shop.name}</p>
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
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
