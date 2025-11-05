import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const categories = [
    { name: 'Motor Parçaları', slug: 'motor-parcalari', icon: '🔧', description: 'Motor ve bağlantı parçaları' },
    { name: 'Fren Sistemi', slug: 'fren-sistemi', icon: '🛑', description: 'Fren diskleri, balatalar ve hidrolik parçalar' },
    { name: 'Süspansiyon', slug: 'suspansiyon', icon: '🔩', description: 'Amortisörler ve süspansiyon parçaları' },
    { name: 'Elektrik', slug: 'elektrik', icon: '⚡', description: 'Elektrikli sistemler ve aksesuarlar' },
    { name: 'Kaporta', slug: 'kaporta', icon: '🚗', description: 'Kaporta parçaları ve aksesuarlar' },
    { name: 'İç Aksesuar', slug: 'ic-aksesuar', icon: '🪑', description: 'İç mekan parçaları ve aksesuarlar' },
    { name: 'Egzoz Sistemi', slug: 'egzoz-sistemi', icon: '💨', description: 'Egzoz boruları ve susturucular' },
    { name: 'Yakıt Sistemi', slug: 'yakit-sistemi', icon: '⛽', description: 'Yakıt pompaları ve filtreler' },
    { name: 'Soğutma Sistemi', slug: 'sogutma-sistemi', icon: '❄️', description: 'Radyatör ve soğutma parçaları' },
    { name: 'Aydınlatma', slug: 'aydinlatma', icon: '💡', description: 'Far, stop ve sinyal lambaları' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categories created');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
