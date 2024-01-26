import { Upload, UploadResult } from "@/lib/useFileUpload";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { X, File as FileIcon } from "lucide-react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { formatDownloadSecounds, formatFileSize } from "@/lib/utils";
import FileDownloadLink from "./FileDownloadLink";
import ClientOnly from "../ClientOnly";
import { Separator } from "../ui/separator";

export default function FileUploadForm({
    file,
    setFile,
    result,
    setResult,
    upload,
    resetFileUpload,
}: {
    file: File;
    setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
    result: UploadResult | undefined;
    setResult: React.Dispatch<React.SetStateAction<UploadResult | undefined>>;
    upload: Upload;
    resetFileUpload: () => void;
}) {
    const [progress, setProgress] = React.useState<number>(0);
    const [estimatedRemainingTime, setEstimatedRemainingTime] =
        React.useState<number>();
    const [uploading, setUploading] = React.useState<boolean>(false);

    return (
        <>
            <Card className="mx-auto md:w-1/2">
                <CardHeader>File Upload</CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div>
                        <Label>File:</Label>
                        <File
                            file={file}
                            clearFile={resetFileUpload}
                            showX={!result || !!uploading}
                        />
                    </div>

                    <div>
                        {!result ? (
                            <>
                                {!!uploading ? (
                                    <div>
                                        <div className="flex items-center justify-center gap-4">
                                            <Progress value={progress} />
                                            <p className="text-right">
                                                {Math.ceil(progress)}%
                                            </p>
                                        </div>
                                        {!!estimatedRemainingTime && (
                                            <p>
                                                Estimated time:{" "}
                                                {formatDownloadSecounds(
                                                    estimatedRemainingTime
                                                )}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={async () => {
                                                console.log("click upload");
                                                setUploading(true);
                                                if (file) {
                                                    console.log(
                                                        "uploading file ..."
                                                    );
                                                    const result = await upload(
                                                        {
                                                            file: file,
                                                            onProgress: (
                                                                progress,
                                                                estimatedRemainingTime
                                                            ) => {
                                                                setProgress(
                                                                    progress
                                                                );
                                                                setEstimatedRemainingTime(
                                                                    estimatedRemainingTime
                                                                );
                                                            },
                                                        }
                                                    );
                                                    setResult(result);
                                                }
                                                setUploading(false);
                                            }}
                                        >
                                            Upload
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <FileUploadSuccess
                                result={result}
                                done={() => {
                                    resetFileUpload();
                                }}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

function FileUploadSuccess({
    result,
    done,
}: {
    result: UploadResult;
    done: () => void;
}) {
    return (
        <div>
            <Separator className="mb-6 mt-3" />
            {result.status === "error" ? (
                <>
                    <p>Something went wrong</p>
                    <p>{result.error}</p>
                    <Button
                        onClick={() => {
                            done();
                        }}
                    >
                        Try Again
                    </Button>
                </>
            ) : (
                <div className="flex flex-col gap-2">
                    <p className="text-green-500">Upload Successful</p>
                    <ClientOnly>
                        <FileDownloadLink downloadKey={result.downloadKey} />
                    </ClientOnly>
                    <div className="flex justify-end">
                        <Button
                            onClick={() => {
                                done();
                            }}
                        >
                            Upload More
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function File({
    file,
    clearFile,
    showX = true,
}: {
    file: File;
    clearFile: () => void;
    showX?: boolean;
}) {
    return (
        <Card className="relative w-44">
            <CardHeader></CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
                {showX && (
                    <button
                        className="absolute right-2 top-2"
                        onClick={clearFile}
                    >
                        <X />
                    </button>
                )}

                <FileIcon />
                <p className="text-gray-600">{file.name}</p>
                <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                </p>
            </CardContent>
        </Card>
    );
}
