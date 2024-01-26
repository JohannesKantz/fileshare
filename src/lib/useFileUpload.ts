import {
    checkIfFileExists,
    getS3Key,
    getSignedUrl,
    saveFileInDB,
} from "./server/actions";
import axios from "axios";

export default function useFileUpload() {
    async function upload({
        file,
        onProgress,
        expiresAt,
    }: {
        file: File;
        onProgress?: OnProgress;
        expiresAt?: Date;
    }) {
        try {
            const s3Key = await getS3Key(file.name);
            const downloadKey = s3Key.split("/")[0];
            const signedUrl = await getSignedUrl(s3Key);

            const response = await uploadFile(
                file,
                signedUrl,
                onProgress || (() => {})
            );

            const fileExists = await checkIfFileExists(s3Key);
            if (!fileExists) {
                throw new Error("File upload failed");
            }

            const dbResult = await saveFileInDB(
                file.name,
                file.size,
                s3Key,
                downloadKey,
                expiresAt || null
            );
            if (!dbResult) {
                throw new Error("Failed to save file in database");
            }

            const uploadResult: UploadResult = {
                status: "success",
                name: file.name,
                downloadKey: downloadKey,
            };

            return uploadResult;
        } catch (e) {
            console.error(e);
        }
    }

    return { upload };
}

export interface UploadResult {
    status: "success" | "error";
    error?: string;
    name: string;
    downloadKey: string;
}

export type OnProgress = (
    progress: number,
    estimatedRemainingTime?: number
) => void;
export type Upload = ReturnType<typeof useFileUpload>["upload"];

function uploadFile(file: File, url: string, onProgress: OnProgress) {
    onProgress(0);
    const startTime = Date.now();
    return axios.put(url, file, {
        onUploadProgress: (e) => {
            const elapsedTime = Date.now() - startTime;
            const uploadSpeed = e.loaded / elapsedTime;
            const estimatedRemainingTime =
                (e.total! - e.loaded) / uploadSpeed / 1000;
            onProgress((e.loaded / e.total!) * 100, estimatedRemainingTime);
        },
    });
}
