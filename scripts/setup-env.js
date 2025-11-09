const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

// Check if .env exists
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 .env dosyası oluşturuluyor...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✓ .env dosyası .env.example\'dan kopyalandı');
    console.log('⚠️  NEXTAUTH_SECRET\'i güvenli bir değerle değiştirmeyi unutmayın!');
  } else {
    console.error('❌ .env.example dosyası bulunamadı!');
    process.exit(1);
  }
} else {
  console.log('✓ .env dosyası zaten mevcut');
}
