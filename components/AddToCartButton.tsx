"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { ShoppingCart, Check } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string | null;
  shop: {
    id: string;
    name: string;
  };
}

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const images = product.images ? JSON.parse(product.images) : [];

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: images[0],
      shopId: product.shop.id,
      shopName: product.shop.name,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-gray-700 font-medium">Adet:</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-4 py-2 border-x">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
          added
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Sepete Eklendi
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Sepete Ekle
          </>
        )}
      </button>
    </div>
  );
}
