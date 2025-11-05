import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

async function getSellerProducts(shopId: string) {
  try {
    const products = await prisma.product.findMany({
      where: { shopId },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function SellerProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SELLER" || !session.user.shopId) {
    redirect("/login");
  }

  const products = await getSellerProducts(session.user.shopId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ürünlerim</h1>
            <p className="text-gray-600">{products.length} ürün bulundu</p>
          </div>
          <Link
            href="/seller/products/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Yeni Ürün Ekle
          </Link>
        </div>

        {/* Products List */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Henüz Ürün Eklemediniz</h2>
            <p className="text-gray-600 mb-8">
              İlk ürününüzü ekleyerek satışa başlayın!
            </p>
            <Link
              href="/seller/products/new"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Ürün Ekle
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold">Ürün</th>
                    <th className="text-left py-4 px-4 font-semibold">Kategori</th>
                    <th className="text-left py-4 px-4 font-semibold">Fiyat</th>
                    <th className="text-left py-4 px-4 font-semibold">Stok</th>
                    <th className="text-left py-4 px-4 font-semibold">Durum</th>
                    <th className="text-left py-4 px-4 font-semibold">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const images = product.images ? JSON.parse(product.images) : [];
                    return (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {images[0] ? (
                                <img
                                  src={images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">{product.name}</p>
                              {product.sku && (
                                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">{product.category.name}</td>
                        <td className="py-4 px-4 font-semibold">
                          {formatPrice(product.price)}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`${
                              product.stock === 0
                                ? "text-red-600"
                                : product.stock <= 5
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.isActive ? "Aktif" : "Pasif"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/seller/products/edit/${product.id}`}
                              className="p-2 hover:bg-gray-200 rounded-lg"
                              title="Düzenle"
                            >
                              <Edit className="h-5 w-5 text-blue-600" />
                            </Link>
                            <button
                              className="p-2 hover:bg-gray-200 rounded-lg"
                              title="Sil"
                            >
                              <Trash2 className="h-5 w-5 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
