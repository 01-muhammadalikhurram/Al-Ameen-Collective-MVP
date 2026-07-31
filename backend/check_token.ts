import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const order = await prisma.order.findUnique({
    where: { public_order_id: 'ORD-0E720B' },
    include: { vendorTokens: true }
  });
  console.log(JSON.stringify(order, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
