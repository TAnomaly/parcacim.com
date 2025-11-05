import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Store, Package, ShoppingCart, Truck } from "lucide-react";
import Link from "next/link";

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        shop: true,
        category: true,
      },
    });
    return product;
  } catch (error) {
    return null;
  }
}

async function getRelatedProducts(productId: string, categoryId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId,
        NOT: { id: productId },
      },
      include: {
        shop: true,
      },
      take: 4,
    });
    return products;
  } catch (error) {
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId);
  const images = product.images ? JSON.parse(product.images) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Ana Sayfa</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-blue-600">Ürünler</Link></li>
            <li>/</li>
            <li><Link href={`/products?category=${product.category.slug}`} className="hover:text-blue-600">{product.category.name}</Link></li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              {images.length > 0 ? (
                <img
                  src={images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Package className="h-32 w-32 text-gray-400" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square bg-white rounded-lg overflow-hidden shadow">
                    <img src={img} alt={`${product.name} ${idx + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Shop Info */}
            <Link
              href={`/shops/${product.shop.slug}`}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4"
            >
              <Store className="h-5 w-5" />
              <span>{product.shop.name}</span>
            </Link>

            {/* Price */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {formatPrice(product.price)}
              </div>
              {product.comparePrice && product.comparePrice > product.price && (
                <div className="text-gray-500 line-through">
                  {formatPrice(product.comparePrice)}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Package className="h-5 w-5" />
                  <span className="font-medium">Stokta ({product.stock} adet)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <Package className="h-5 w-5" />
                  <span className="font-medium">Stokta Yok</span>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            {product.stock > 0 && (
              <AddToCartButton product={product} />
            )}

            {/* Product Details */}
            <div className="border-t mt-6 pt-6 space-y-3">
              {product.brand && (
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">Marka:</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
              )}
              {product.model && (
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">Model:</span>
                  <span className="font-medium">{product.model}</span>
                </div>
              )}
              {product.year && (
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">Yıl:</span>
                  <span className="font-medium">{product.year}</span>
                </div>
              )}
              {product.partNumber && (
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">Parça No:</span>
                  <span className="font-medium">{product.partNumber}</span>
                </div>
              )}
              {product.condition && (
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">Durum:</span>
                  <span className="font-medium">{product.condition}</span>
                </div>
              )}
              {product.sku && (
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="border-t mt-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-5 w-5" />
                  <span>Hızlı Kargo</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Güvenli Alışveriş</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
            <h2 className="text-2xl font-bold mb-4">Ürün Açıklaması</h2>
            <div className="text-gray-700 whitespace-pre-wrap">{product.description}</div>
          </div>
        )}

        {/* Compatibility */}
        {product.compatibility && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
            <h2 className="text-2xl font-bold mb-4">Uyumluluk</h2>
            <div className="text-gray-700 whitespace-pre-wrap">{product.compatibility}</div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    {relatedProduct.images ? (
                      <img
                        src={JSON.parse(relatedProduct.images)[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{relatedProduct.shop.name}</p>
                    <h3 className="font-semibold mb-2 line-clamp-2 text-sm">
                      {relatedProduct.name}
                    </h3>
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(relatedProduct.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
