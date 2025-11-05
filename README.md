# 🚗 Parçacım - Araba Yedek Parça Pazaryeri

Türkiye'nin en kapsamlı araba yedek parça pazaryeri platformu. Çok satıcılı (multi-vendor) mimari ile binlerce mağaza ve milyonlarca ürün.

## 🎯 Özellikler

### Müşteri Özellikleri
- ✅ Gelişmiş ürün arama ve filtreleme
- ✅ Kategori bazlı gezinme
- ✅ Ürün detay sayfaları
- ✅ Sepet yönetimi (mağaza bazlı gruplama)
- ✅ Checkout (sipariş tamamlama) sistemi
- ✅ Sipariş takibi ve detaylı sipariş görüntüleme
- ✅ Mağaza listeleme ve detay sayfaları
- ✅ Kullanıcı hesap yönetimi

### Satıcı Özellikleri
- ✅ Mağaza oluşturma ve yönetimi
- ✅ Ürün ekleme/düzenleme/silme (tam CRUD)
- ✅ Stok yönetimi (otomatik stok düşürme)
- ✅ Sipariş yönetimi ve durum güncelleme
- ✅ Satış istatistikleri (gelir, ürün, sipariş sayıları)
- ✅ Dashboard paneli (düşük stok uyarıları)
- ✅ Gerçek zamanlı sipariş durumu güncelleme

### Teknik Özellikler
- ✅ Next.js 14 (App Router)
- ✅ TypeScript
- ✅ Prisma ORM
- ✅ NextAuth.js kimlik doğrulama
- ✅ Tailwind CSS
- ✅ Responsive tasarım
- ✅ SEO optimizasyonu

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Veritabanını oluşturun:**
```bash
npx prisma migrate dev --name init
```

3. **Örnek verileri ekleyin:**
```bash
npx prisma db seed
```

4. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

5. **Tarayıcınızda açın:**
```
http://localhost:3000
```

## 📁 Proje Yapısı

```
parcacim.com/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── seller/            # Satıcı paneli sayfaları
│   ├── products/          # Ürün sayfaları
│   ├── cart/              # Sepet sayfası
│   └── ...
├── components/            # React bileşenleri
├── lib/                   # Yardımcı fonksiyonlar
├── prisma/                # Veritabanı şeması ve seed
├── store/                 # Zustand state management
└── types/                 # TypeScript tip tanımlamaları
```

## 🗄️ Veritabanı Modelleri

- **User**: Kullanıcılar (Alıcı/Satıcı)
- **Shop**: Mağazalar
- **Category**: Ürün kategorileri
- **Product**: Ürünler
- **CartItem**: Sepet öğeleri
- **Order**: Siparişler
- **OrderItem**: Sipariş detayları

## 🔐 Kimlik Doğrulama

NextAuth.js ile güvenli kimlik doğrulama:
- Email/şifre ile giriş
- Kullanıcı rolleri (BUYER, SELLER, ADMIN)
- Session yönetimi
- Korumalı sayfalar

## 🛒 Sepet Sistemi

Zustand ile client-side state management:
- Ürün ekleme/çıkarma
- Miktar güncelleme
- Mağaza bazlı gruplama
- Persistent storage

## 👨‍💼 Satıcı Olma

1. `/seller/register` sayfasından kayıt olun
2. Mağaza bilgilerinizi girin
3. Onaylandıktan sonra satışa başlayın
4. Dashboard'dan ürün ve sipariş yönetimi yapın

## 📱 Responsive Tasarım

- Mobil öncelikli tasarım
- Tablet ve desktop desteği
- Touch-friendly arayüz
- Hızlı sayfa yükleme

## 🔧 Geliştirme

### Veritabanı güncellemeleri:
```bash
npx prisma migrate dev
npx prisma generate
```

### Veritabanını sıfırla:
```bash
npx prisma migrate reset
```

### Production build:
```bash
npm run build
npm start
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- Next.js ekibine
- Prisma ekibine
- Tüm açık kaynak katkıda bulunanlara

---

**Parçacım** - Arabanız için her parça burada! 🚗
