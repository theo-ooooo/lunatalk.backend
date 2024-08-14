import { PrismaClient } from '@prisma/client';
import { products, colors, images } from './sql/product.json';
import axios from 'axios';
import { productImageUpload } from '../src/services/imageService';

const prisma = new PrismaClient();

async function categoryInit() {
  const categories = await prisma.category.createMany({
    data: [
      { name: 'acc', active: 'Y' },
      { name: 'bag', active: 'Y' },
      { name: 'stationery', active: 'Y' },
      { name: 'wallet', active: 'Y' },
      { name: 'military', active: 'Y' },
    ],
    skipDuplicates: true,
  });

  console.log('category init done', categories);
}

async function productColorOptionsInit() {
  const colorOptionSql = `
  INSERT IGNORE INTO colorOptions (name, active)
 VALUES
 ('초콜릿', 'Y'),
 ('레드', 'Y'),
 ('네이비', 'Y'),
 ('베리밀크', 'Y'),
 ('화이트', 'Y'),
 ('엔티크', 'Y'),
 ('카키', 'Y'),
 ('베이지', 'Y'),
 ('핫핑크', 'Y'),
 ('오렌지브라운', 'Y'),
 ('올리브그린', 'Y'),
 ('카멜베이지', 'Y'),
 ('포레스트크린', 'Y'),
 ('블랙', 'Y'),
 ('스트로베리 레드', 'Y'),
 ('머스타드옐로우', 'Y'),
 ('스카이블루', 'Y'),
 ('스트로베리레드', 'Y'),
 ('카키브라운', 'Y'),
 ('멜론그린', 'Y'),
 ('크림슨레드', 'Y'),
 ('아쿠아블루', 'Y'),
 ('초코', 'Y'),
 ('블루', 'Y'),
 ('라일락', 'Y'),
 ('카멜', 'Y'),
 ('다크초콜릿', 'Y'),
 ('블루블랙', 'Y'),
 ('브라운', 'Y'),
 ('아이보리', 'Y'),
 ('다크브라운', 'Y'),
 ('와인', 'Y'),
 ('핑크', 'Y'),
 ('블랙에나멜', 'Y'),
 ('아이보리에나멜', 'Y'),
 ('레드에나멜', 'Y'),
 ('그린', 'Y'),
 ('퍼플', 'Y'),
 ('민트', 'Y'),
 ('펄옐로우', 'Y'),
 ('라임', 'Y'),
 ('허니옐로우', 'Y'),
 ('머스터드옐로우', 'Y'),
 ('체리레드', 'Y'),
 ('허니카라멜', 'Y'),
 ('초코쿠키', 'Y'),
 ('세피아', 'Y'),
 ('체리봉봉', 'Y'),
 ('블루베리', 'Y'),
 ('애플그린', 'Y'),
 ('마린블루', 'Y'),
 ('카라멜', 'Y'),
 ('베이비핑크', 'Y'),
 ('커피브라운', 'Y'),
 ('바이올렛핑크', 'Y'),
 ('라임옐로우', 'Y'),
 ('디지털', 'Y');
 `;

  await prisma.$executeRawUnsafe(colorOptionSql);
}

async function productInit() {
  await prisma.product.deleteMany({});
  products.forEach(async (sql: string) => {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log('success :', sql);
    } catch (e) {
      console.log('fail :', e);
    }
  });
}

async function productColorOptionInit() {
  await prisma.productColorOption.deleteMany({});
  colors.forEach(async (sql: string) => {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log('success :', sql);
    } catch (e) {
      console.log('fail :', e);
    }
  });
}

async function productImagesInit() {
  await prisma.productDetailImages.deleteMany({});
  await prisma.productThumbnailImages.deleteMany({});

  images.forEach(async (o) => {
    try {
      const response = await axios.get(
        `https://media.lunatalk.co.kr${o.path}`,
        {
          responseType: 'arraybuffer',
        }
      );

      const file = Buffer.from(response.data, 'binary');

      console.log(response.data);

      await productImageUpload(
        o.productId,
        o.mediaCategory === 'rep' ? 'thumbnail' : 'detail',
        file
      );
      console.log('success', o.productId, o.path);
    } catch (e) {
      console.log(e);
      console.log('fail', o.productId, o.path);
    }
  });
}

async function main() {
  // await categoryInit();
  // await productColorOptionsInit();
  // await productInit();
  // await productColorOptionInit();
  await productImagesInit();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
