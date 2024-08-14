import { v4 as uuidV4 } from 'uuid';
import os from 'os';
import fs from 'fs';
import sharp from 'sharp';
import { PutObject } from '../../tools/aws/s3';
import prismaClient from '../../tools/client';
import axios from 'axios';

const TEMPORARY_PATH = os.tmpdir();

const imageBucket = process.env.IMAGE_BUCKET as string;

function createImageId() {
  return uuidV4();
}

async function convertToImage(
  buffer: Buffer,
  source: string,
  convertType: string
) {
  console.log('convertType', convertType);
  try {
    switch (convertType) {
      case 'webp': {
        await sharp(buffer)
          .webp({ quality: 90, alphaQuality: 90 })
          .toFile(source);
        break;
      }
      case 'jpeg': {
        await sharp(buffer).jpeg({ quality: 90 }).toFile(source);
        break;
      }
      default:
        throw new Error(`not supported`);
    }
  } catch (e) {
    throw e;
  }
}

async function getImage(source: string) {
  try {
    const metaData = await sharp(source).metadata();
    const size = fs.statSync(source).size;

    return {
      width: metaData?.width || 0,
      height: metaData?.height || 0,
      size,
    };
  } catch (e) {
    throw e;
  }
}

async function imageUpload(file: Buffer, uploadPath: string) {
  const IMAGE_UUID = createImageId();

  const source = `${TEMPORARY_PATH}/${IMAGE_UUID}`;

  const webpSource = `${source}.webp`;
  const jpegSource = `${source}.jpeg`;

  fs.writeFileSync(source, file);

  try {
    await Promise.all([
      convertToImage(file, jpegSource, 'jpeg'),
      convertToImage(file, webpSource, 'webp'),
    ]);

    const [metaData, webpMetadata, jpegMetadata] = await Promise.all([
      getImage(source),
      getImage(webpSource),
      getImage(jpegSource),
    ]);

    const key = `${process.env.ENVIRONMENT}/${uploadPath}/original/${IMAGE_UUID}`;
    const webpKey = `${process.env.ENVIRONMENT}/${uploadPath}/webp/${IMAGE_UUID}.webp`;
    const jpegKey = `${process.env.ENVIRONMENT}/${uploadPath}/jpeg/${IMAGE_UUID}.jpeg`;

    await Promise.all([
      PutObject(
        imageBucket,
        key,
        fs.readFileSync(source),
        'application/octet-stream'
      ),
      PutObject(
        imageBucket,
        webpKey,
        fs.readFileSync(webpSource),
        'image/webp'
      ),
      PutObject(
        imageBucket,
        jpegKey,
        fs.readFileSync(jpegSource),
        'image/jpeg'
      ),
    ]);

    // 업로드후 로컬에 파일 삭제.
    await Promise.all([
      fs.unlinkSync(source),
      fs.unlinkSync(webpSource),
      fs.unlinkSync(jpegSource),
    ]);

    return {
      imageId: IMAGE_UUID,
      original: key,
      webp: webpKey,
      jpeg: jpegKey,
      bucket: imageBucket,
      metaData,
      webpMetadata,
      jpegMetadata,
    };
  } catch (e) {
    throw e;
  }
}

export async function productImageUpload(
  productId: number,
  imageType: string,
  file: Buffer
) {
  try {
    const uploadObject = await imageUpload(
      file,
      `products/${productId}/${imageType}`
    );

    console.log('uploadObject', uploadObject);

    if (!uploadObject) {
      throw new Error(`uploadObject not found`);
    }
    if (imageType === 'detail') {
      await prismaClient.productDetailImages.create({
        data: {
          uuid: uploadObject.imageId,
          productId,
          original: uploadObject.original,
          webp: uploadObject.webp,
          jpeg: uploadObject.jpeg,
          originalBucket: uploadObject.bucket,
          webpBucket: uploadObject.bucket,
          jpegBucket: uploadObject.bucket,
          width: uploadObject.metaData.width,
          height: uploadObject.metaData.height,
          fileSizeWebp: uploadObject.webpMetadata.size,
          fileSizeJpeg: uploadObject.jpegMetadata.size,
        },
      });
    } else if (imageType === 'thumbnail') {
      await prismaClient.productThumbnailImages.create({
        data: {
          uuid: uploadObject.imageId,
          productId,
          original: uploadObject.original,
          webp: uploadObject.webp,
          jpeg: uploadObject.jpeg,
          originalBucket: uploadObject.bucket,
          webpBucket: uploadObject.bucket,
          jpegBucket: uploadObject.bucket,
          width: uploadObject.metaData.width,
          height: uploadObject.metaData.height,
          fileSizeWebp: uploadObject.webpMetadata.size,
          fileSizeJpeg: uploadObject.jpegMetadata.size,
        },
      });
    }
  } catch (e) {
    throw e;
  }
}

export default async function uploadTest() {
  const response = await axios.get(
    'https://media.lunatalk.co.kr/storage/products/rep/6cfbd8f340e67cf8791d7a638b91df80f4c2ef7e/lThIT0rDspjSBZvjKMgjDUBKXECsQFO8b8gaoZs2.jpg',
    { responseType: 'arraybuffer' }
  );

  console.log(response.data);

  const file = Buffer.from(response.data, 'binary');

  console.log(file);

  await productImageUpload(1, 'thumbnail', file);
}
