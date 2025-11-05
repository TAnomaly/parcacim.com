"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const statusOptions = [
  { value: "PENDING", label: "Beklemede" },
  { value: "PROCESSING", label: "Hazırlanıyor" },
  { value: "SHIPPED", label: "Kargoda" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELLED", label: "İptal Edildi" },
];

export function OrderStatusUpdate({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        router.refresh();
        setIsOpen(false);
      } else {
        alert("Durum güncellenirken bir hata oluştu");
      }
    } catch (error) {
      alert("Durum güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg"
        title="Durumu Güncelle"
      >
        <Settings className="h-5 w-5 text-gray-600" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 py-1">
            <div className="px-3 py-2 border-b">
              <p className="text-xs font-semibold text-gray-600">Durumu Güncelle</p>
            </div>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusUpdate(option.value as OrderStatus)}
                disabled={loading}
                className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm ${
                  currentStatus === option.value
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
