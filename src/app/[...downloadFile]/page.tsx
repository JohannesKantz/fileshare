import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { getSignedUrlDownload } from "@/lib/server/actions";
import { formatFileSize } from "@/lib/utils";
import React from "react";

export default async function page({
    params,
}: {
    params: { downloadFile: string };
}) {
    const fileDownloadKey = params.downloadFile.toString();

    const file = await prisma.file.findUnique({
        where: {
            downloadKey: fileDownloadKey,
        },
    });

    if (!file) {
        return <div>File not found</div>;
    }

    const downloadURL = await getSignedUrlDownload(file.s3Key);

    return (
        <main className="container flex flex-col items-center justify-center">
            <Card>
                <CardHeader>Download File</CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div>
                        <p>Filename: {file.name}</p>
                        <p>FileSize: {formatFileSize(file.size)}</p>
                    </div>

                    <a href={downloadURL} download={file.name}>
                        <Button>Download</Button>
                    </a>
                </CardContent>
            </Card>
        </main>
    );
}
