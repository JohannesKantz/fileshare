import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const S3_BUCKET = process.env.S3_BUCKET!;
export const S3_REGION = process.env.S3_REGION!;
export const S3_ENDPOINT = process.env.S3_ENDPOINT!;
export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID!;
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY!;

if (!S3_BUCKET) {
    throw new Error("S3_BUCKET is not defined");
}
if (!S3_REGION) {
    throw new Error("S3_REGION is not defined");
}
if (!S3_ENDPOINT) {
    throw new Error("S3_ENDPOINT is not defined");
}
if (!S3_ACCESS_KEY_ID) {
    throw new Error("S3_ACCESS_KEY_ID is not defined");
}
if (!S3_SECRET_ACCESS_KEY) {
    throw new Error("S3_SECRET_ACCESS_KEY is not defined");
}

const S3 = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});

export { S3 };

export function getSignedUrlToUpload(bucket: string, key: string) {
    return getSignedUrl(
        S3,
        new PutObjectCommand({ Bucket: bucket, Key: key }),
        { expiresIn: 3600 }
    );
}

export function getSignedUrlToDownload(bucket: string, key: string) {
    return getSignedUrl(
        S3,
        new GetObjectCommand({ Bucket: bucket, Key: key }),
        { expiresIn: 3600 }
    );
}

export function deleteFileFromS3(bucket: string, key: string) {
    return S3.send(
        new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
        })
    );
}
