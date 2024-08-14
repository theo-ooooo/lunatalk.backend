import {
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-providers';

const client = new S3Client({
  region: 'ap-northeast-2',
  credentials: fromIni({ profile: process.env.AWS_PROFILE }),
});

export async function ListBuckets() {
  try {
    const data = await client.send(new ListBucketsCommand({}));

    return data.Buckets;
  } catch (e) {
    throw e;
  }
}

export async function PutObject(
  bucket: string,
  key: string,
  body: Buffer,
  contentType: string | undefined
) {
  try {
    const commend = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    return await client.send(commend);
  } catch (e) {
    throw e;
  }
}
