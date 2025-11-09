"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Store, ArrowLeft, CheckCircle, Sparkles, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function BecomeSellerPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    shopPhone: "",
    shopAddress: "",
    shopEmail: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    // If user already has a shop, redirect to seller dashboard
    if (session.user.shopId) {
      router.push("/seller/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/shops/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Shop creation error:", data);
        setError(data.error || "Mağaza oluşturulurken bir hata oluştu");
        return;
      }

      // Show success message
      setSuccess(true);

      // Update session
      await update();

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/seller/dashboard?new_shop=true");
      }, 2000);
    } catch (err) {
      console.error("Shop creation exception:", err);
      setError("Mağaza oluşturulurken bir hata oluştu: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tebrikler! 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            Mağazanız başarıyla oluşturuldu. Satıcı panelinize yönlendiriliyorsunuz...
          </p>
          <div className="animate-pulse flex justify-center">
            <div className="h-2 bg-green-600 rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Ana Sayfaya Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Benefits */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Store className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                Satıcı Olun,<br />
                <span className="text-blue-600">Kazanmaya Başlayın!</span>
              </h2>
              <p className="text-lg text-gray-600">
                Kendi mağazanızı açın ve milyonlarca müşteriye ulaşın
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
                Satıcı Olmanın Avantajları
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Ücretsiz Mağaza</h4>
                    <p className="text-gray-600 text-sm">Hiçbir ücret ödemeden mağazanızı açın</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-blue-100 p-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Kolay Satış</h4>
                    <p className="text-gray-600 text-sm">Ürünlerinizi kolayca ekleyin ve satın</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-purple-100 p-2">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Geniş Müşteri Kitlesi</h4>
                    <p className="text-gray-600 text-sm">Binlerce potansiyel alıcıya ulaşın</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Mağaza Bilgileri
                </h3>
                <p className="text-gray-600 text-sm">
                  Mağazanızı oluşturmak için gerekli bilgileri girin
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded animate-shake">
                  <p className="font-medium">Hata!</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mağaza Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Örn: Ankara Oto Yedek Parça"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mağaza Açıklaması
                  </label>
                  <textarea
                    rows={4}
                    value={formData.shopDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, shopDescription: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Mağazanız hakkında kısa bir açıklama yazın..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mağaza Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.shopEmail}
                      onChange={(e) => setFormData({ ...formData, shopEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="magaza@ornek.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mağaza Telefon *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.shopPhone}
                      onChange={(e) => setFormData({ ...formData, shopPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="05XX XXX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mağaza Adresi *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.shopAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, shopAddress: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tam adresinizi yazın"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Oluşturuluyor...
                    </span>
                  ) : (
                    "Mağazamı Oluştur"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
