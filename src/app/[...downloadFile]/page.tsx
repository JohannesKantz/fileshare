import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { deleteExpiredFiles, getSignedUrlDownload } from "@/lib/server/actions";
import { formatFileSize } from "@/lib/utils";
import type { File } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { FileIcon } from "lucide-react";
import React from "react";

export default async function page({
    params,
}: {
    params: { downloadFile: string };
}) {
    const fileDownloadKey = params.downloadFile.toString();

    await deleteExpiredFiles();
    const file = await prisma.file.findUnique({
        where: {
            downloadKey: fileDownloadKey,
        },
    });

    if (!file) {
        return (
            <main className="container flex flex-col items-center justify-center">
                <div>File not found</div>
            </main>
        );
    }

    const downloadURL = await getSignedUrlDownload(file.s3Key, file.name);

    return (
        <main className="container flex flex-col items-center justify-center">
            <Card className="w-full md:w-1/2">
                <CardHeader>
                    <h2 className="text-xl">Download File</h2>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex justify-center">
                        <File file={file} />
                    </div>
                    <Separator className="my-2" />
                    <div className="text-right">
                        <a href={downloadURL} download={file.name}>
                            <Button>Download</Button>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}

function File({ file }: { file: File }) {
    return (
        <Card className="relative w-44">
            <CardHeader></CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
                <FileIcon size={48} />
                <p className="text-center text-gray-600">{file.name}</p>
                <p className="text-sm font-bold text-gray-500">
                    {formatFileSize(file.size)}
                </p>
            </CardContent>
        </Card>
    );
}
