"use server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import {
    S3,
    S3_BUCKET,
    deleteFileFromS3,
    getSignedUrlToDownload,
    getSignedUrlToUpload,
} from "./s3";
import { auth } from "../auth";
import prisma from "../prisma";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function getS3Key(fileName: string) {
    let s3Key;

    while (true) {
        const randomID = nanoid();
        s3Key = `${randomID}/${fileName}`;

        // Check if file exists in db
        const res = await prisma.file.findUnique({
            where: {
                s3Key: s3Key,
            },
        });
        if (!res) break;
    }

    return s3Key;
}

export async function getSignedUrl(s3Key: string) {
    return getSignedUrlToUpload(S3_BUCKET, s3Key);
}

export async function checkIfFileExists(s3Key: string) {
    try {
        const res = await S3.send(
            new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: s3Key,
            })
        );
        return true;
    } catch (e) {
        return false;
    }
}

export async function getSignedUrlDownload(s3Key: string) {
    try {
        return getSignedUrlToDownload(S3_BUCKET, s3Key);
    } catch (e) {
        console.error(e);
    }
}

export async function saveFileInDB(
    fileName: string,
    fileSize: number,
    s3Key: string,
    downloadKey: string,
    expiresAt: Date | null
) {
    const session = await auth();

    if (!checkIfFileExists(s3Key)) throw new Error("File does not exist");

    if (!session) {
        const res = await prisma.file.create({
            data: {
                name: fileName,
                size: fileSize,
                s3Key: s3Key,
                downloadKey: downloadKey,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day
            },
        });

        return !!res;
    }
    if (!session.user) throw new Error("No user");
    const res = await prisma.file.create({
        data: {
            name: fileName,
            size: fileSize,
            s3Key: s3Key,
            downloadKey: downloadKey,
            expiresAt: expiresAt,
            user: {
                connect: {
                    id: session.user.id,
                },
            },
        },
    });
    revalidatePath("/profile");
    return !!res;
}

export async function deleteFile(s3Key: string) {
    try {
        await deleteFileFromS3(S3_BUCKET, s3Key);
        await prisma.file.delete({
            where: {
                s3Key: s3Key,
            },
        });
        revalidatePath("/profile");
    } catch (e) {
        console.error(e);
    }
}

export async function deleteExpiredFiles() {
    const files = await prisma.file.findMany({
        where: {
            expiresAt: {
                lt: new Date(),
            },
        },
    });

    for (const file of files) {
        await deleteFile(file.s3Key);
    }
}
