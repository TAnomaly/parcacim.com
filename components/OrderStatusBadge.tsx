import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

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

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${config.color}`}>
      <Icon className="h-4 w-4" />
      <span className="font-semibold">{config.label}</span>
    </div>
  );
}
