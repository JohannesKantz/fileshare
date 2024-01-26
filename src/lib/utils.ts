import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatFileSize(bytes?: number) {
    if (!bytes) {
        return "0 Bytes";
    }
    bytes = Number(bytes);
    if (bytes === 0) {
        return "0 Bytes";
    }
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDownloadSecounds(seconds: number) {
    seconds = Math.floor(seconds);
    if (seconds < 60) {
        return `${seconds} sec`;
    }
    const minutes = Math.floor(seconds / 60);
    const secounds = seconds % 60;
    return `${minutes} min ${secounds} sec`;
}
