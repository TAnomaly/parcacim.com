#!/bin/bash

# Setup script for Parçacım Marketplace

echo "🚀 Parçacım Marketplace Setup"
echo "================================"

# Check if .env exists
if [ -f .env ]; then
    echo "✓ .env dosyası zaten mevcut"
else
    if [ -f .env.example ]; then
        echo "📝 .env dosyası oluşturuluyor..."
        cp .env.example .env
        echo "✓ .env dosyası .env.example'dan kopyalandı"
        echo "⚠️  NEXTAUTH_SECRET'i güvenli bir değerle değiştirin!"
    else
        echo "❌ .env.example dosyası bulunamadı!"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Dependencies yükleniyor..."
    npm install
fi

echo ""
echo "✓ Kurulum tamamlandı!"
echo ""
echo "📋 Sonraki adımlar:"
echo "1. npx prisma generate    # Prisma client oluştur"
echo "2. npx prisma migrate dev # Veritabanını oluştur"
echo "3. npx prisma db seed     # Örnek veri ekle"
echo "4. npm run dev            # Geliştirme sunucusunu başlat"
