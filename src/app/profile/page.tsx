import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatFileSize } from "@/lib/utils";
import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { File } from "@prisma/client";
import DeleteButton from "./DeleteButton";
import { Download } from "lucide-react";
import DownloadButton from "./DownloadButton";
import ClientOnly from "@/components/ClientOnly";

export const dynamic = "force-dynamic";

export default async function page() {
    const session = await auth();

    if (!session) {
        return <div>Not logged in</div>;
    }
    if (!session.user) return;

    const files = await prisma.file.findMany({
        where: {
            userId: session.user.id,
        },
    });

    return (
        <div className="container flex min-h-screen flex-col items-center p-24">
            <h2 className="self-start">Profile Page</h2>

            <FileTable files={files} />
        </div>
    );
}

function FileTable({ files }: { files: Array<File> }) {
    return (
        <Table>
            <TableCaption>A list of all your files.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">File Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>upload date</TableHead>
                    <TableHead>expiry date</TableHead>
                    <TableHead>Download Link</TableHead>
                    <TableHead className="text-end">Delete</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {files.map((file, i) => (
                    <TableRow key={i}>
                        <TableCell className="font-medium">
                            {file.name}
                        </TableCell>
                        <TableCell className="text-slate-500">
                            {formatFileSize(file.size)}
                        </TableCell>
                        <TableCell className="text-slate-500">
                            {file.createdAt?.toLocaleDateString() ?? "unknown"}
                        </TableCell>
                        <TableCell className="text-slate-500">
                            {file.expiresAt?.toLocaleDateString() ?? "never"}
                        </TableCell>

                        <TableCell>
                            <ClientOnly>
                                <DownloadButton
                                    downloadKey={file.downloadKey}
                                />
                            </ClientOnly>
                        </TableCell>
                        <TableCell className="text-end">
                            <DeleteButton s3Key={file.s3Key} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
