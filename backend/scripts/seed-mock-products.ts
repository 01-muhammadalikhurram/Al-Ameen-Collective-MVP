import fs from 'fs';
import path from 'path';
import { prisma } from '../src/config/prisma';

const sourceDir = 'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\23b9cc58-62d1-45f0-aced-42b260f3a5f8';
const destDir = 'f:\\Web Development\\Al Ameen Collective MVP\\frontend\\public\\mock-images';

// Make sure dest dir exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map of image prefix to actual file name generated
const imageFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.png'));

function findImageByPrefix(prefix: string) {
  return imageFiles.find(f => f.startsWith(prefix));
}

const imagesToCopy = [
  { prefix: 'premium_wash_n_wear', name: 'Premium Wash & Wear', category: 'Wash & Wear', season: 'Summer', color: 'Navy Blue', price: 2500, slug: 'premium-wash-wear' },
  { prefix: 'classic_cotton', name: 'Classic Cotton', category: 'Cotton', season: 'Summer', color: 'White', price: 3000, slug: 'classic-cotton' },
  { prefix: 'luxury_karandi', name: 'Luxury Karandi', category: 'Karandi', season: 'Winter', color: 'Camel', price: 4000, slug: 'luxury-karandi' },
  { prefix: 'egyptian_cotton', name: 'Egyptian Cotton', category: 'Egyptian Cotton', season: 'Summer', color: 'Charcoal', price: 5000, slug: 'egyptian-cotton' },
];

async function main() {
  for (const item of imagesToCopy) {
    const fileName = findImageByPrefix(item.prefix);
    if (!fileName) {
      console.error(`Could not find image for prefix ${item.prefix}`);
      continue;
    }

    // 1. Copy image
    const sourcePath = path.join(sourceDir, fileName);
    const destFileName = `${item.prefix}.png`;
    const destPath = path.join(destDir, destFileName);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${fileName} to ${destPath}`);

    // 2. Insert Media
    const media = await prisma.media.create({
      data: {
        url: `/mock-images/${destFileName}`,
        alt_text: item.name,
        file_name: destFileName,
      }
    });

    // 3. Insert Product
    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        description: `Experience the finest ${item.name} fabric. Perfect for your bespoke tailoring needs.`,
        fabric: item.category,
        category: item.category,
        season: item.season,
        status: 'ACTIVE',
        items: {
          create: {
            media_id: media.id,
            product_code: `PRD-${item.prefix.toUpperCase()}`,
            color: item.color,
            wholesale_price: item.price,
            additional_profit: 0,
            status: 'ACTIVE',
          }
        }
      }
    });
    
    console.log(`Created product ${product.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
