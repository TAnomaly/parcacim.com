import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parçacım - Araba Yedek Parça Pazaryeri",
  description: "Türkiye'nin en güvenilir araba yedek parça pazaryeri. Binlerce mağaza, milyonlarca ürün.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-12 mt-20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Parçacım</h3>
                  <p className="text-gray-400">
                    Türkiye'nin en güvenilir araba yedek parça pazaryeri.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Hızlı Linkler</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/products" className="hover:text-white">Ürünler</a></li>
                    <li><a href="/shops" className="hover:text-white">Mağazalar</a></li>
                    <li><a href="/about" className="hover:text-white">Hakkımızda</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Satıcı Ol</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/seller/register" className="hover:text-white">Mağaza Aç</a></li>
                    <li><a href="/seller/dashboard" className="hover:text-white">Satıcı Paneli</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Destek</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/contact" className="hover:text-white">İletişim</a></li>
                    <li><a href="/faq" className="hover:text-white">SSS</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 Parçacım. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
