import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Default Admin User
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {
      password_hash: adminPasswordHash,
    },
    create: {
      username: 'admin',
      password_hash: adminPasswordHash,
    },
  });
  console.log(`✅ Default Admin user created (username: ${admin.username})`);

  // 2. Create Global Pricing Rule
  // Find first, since we don't have a unique constraint to upsert by
  const existingPricingRule = await prisma.pricingRule.findFirst();
  if (!existingPricingRule) {
    await prisma.pricingRule.create({
      data: {
        global_profit: 1000.0, // Default 1000 PKR global profit
      },
    });
    console.log('✅ Default Pricing Rule created (Global Profit: 1000)');
  } else {
    console.log('ℹ️ Pricing Rule already exists, skipping.');
  }

  // 3. Create Delivery Rules
  const existingDeliveryRules = await prisma.deliveryRule.count();
  if (existingDeliveryRules === 0) {
    await prisma.deliveryRule.createMany({
      data: [
        { minimum_order: 5000.0, discount_percentage: 50.0 }, // 50% off for orders > 5000
        { minimum_order: 10000.0, discount_percentage: 100.0 }, // Free delivery for orders > 10000
      ],
    });
    console.log('✅ Default Delivery Rules created');
  } else {
    console.log('ℹ️ Delivery Rules already exist, skipping.');
  }

  // 4. Create Website Settings
  const existingSettings = await prisma.websiteSetting.findFirst();
  if (!existingSettings) {
    await prisma.websiteSetting.create({
      data: {
        default_delivery_charge: 300.0,
        cart_expiry_days: 7,
        whatsapp_number: '923001234567',
        business_name: 'Al Ameen Collective',
      },
    });
    console.log('✅ Default Website Settings created');
  } else {
    console.log('ℹ️ Website Settings already exist, skipping.');
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
