import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bakery.ru' },
    update: {},
    create: {
      email: 'admin@bakery.ru',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', { email: admin.email, role: admin.role });

  // Seed FAQ data
  const faqs = [
    {
      question: 'What allergens do you use?',
      answer:
        'We work with common allergens including gluten, dairy, eggs, and nuts. Please inform us of any allergies when placing an order.',
      isPublished: true,
      order: 0,
    },
    {
      question: 'Do you offer delivery?',
      answer:
        'Yes, we offer delivery for orders within the local area. Delivery fees and availability depend on your location.',
      isPublished: true,
      order: 1,
    },
    {
      question: 'How far in advance should I order?',
      answer:
        'We recommend ordering at least 3-5 days in advance for custom cakes. Simple items may be available sooner.',
      isPublished: true,
      order: 2,
    },
    {
      question: 'Can you accommodate dietary restrictions?',
      answer:
        'We offer vegan and gluten-free options for many of our products. Please contact us to discuss your specific needs.',
      isPublished: true,
      order: 3,
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept cash, card, and online transfers. Payment details will be confirmed when you place your order.',
      isPublished: true,
      order: 4,
    },
  ];

  for (const faq of faqs) {
    await prisma.faq.upsert({
      where: { id: `seed-faq-${faq.order}` },
      update: faq,
      create: {
        id: `seed-faq-${faq.order}`,
        ...faq,
      },
    });
  }

  console.log('Seeded FAQ data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

