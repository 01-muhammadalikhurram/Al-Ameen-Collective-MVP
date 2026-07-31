import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function reset() {
  await prisma.vendorAccessToken.deleteMany({});
  await prisma.order.update({
    where: { public_order_id: 'ORD-0E720B' },
    data: { status: 'PENDING' }
  });
  console.log("Reset successful");
}

reset().catch(console.error).finally(() => prisma.$disconnect());
