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
import FileUploadFormTimeSelect from "./FileUploadFormTimeSelect";

const DeleteAfterOptions = [
    { value: `${1000 * 60 * 60 * 24 * 1}`, label: "1 day" },
    { value: `${1000 * 60 * 60 * 24 * 3}`, label: "3 days" },
    { value: `${1000 * 60 * 60 * 24 * 7}`, label: "1 week" },
    { value: `${1000 * 60 * 60 * 24 * 30}`, label: "1 month" },
    { value: `${1000 * 60 * 60 * 24 * 90}`, label: "3 months" },
    { value: `${1000 * 60 * 60 * 24 * 365}`, label: "1 year" },
    { value: "0", label: "Never" },
];
const defaultDeleteAfter = 0;

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

    const [expiresAtSeconds, setExpiresAtSeconds] = React.useState<string>(
        DeleteAfterOptions[defaultDeleteAfter].value
    );

    async function handleUpload() {
        setUploading(true);
        const expiresAt =
            expiresAtSeconds === "0"
                ? null
                : new Date(new Date().getTime() + parseInt(expiresAtSeconds));

        if (file) {
            const result = await upload({
                file: file,
                onProgress: (progress, estimatedRemainingTime) => {
                    setProgress(progress);
                    setEstimatedRemainingTime(estimatedRemainingTime);
                },
                expiresAt,
            });
            setResult(result);
        }
        setUploading(false);
    }

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

                    <Separator className="my-4" />

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
                                    <div>
                                        <FileUploadFormTimeSelect
                                            options={DeleteAfterOptions}
                                            defaultDeleteAfter={
                                                defaultDeleteAfter
                                            }
                                            onChange={setExpiresAtSeconds}
                                        />
                                        <div className="flex justify-end gap-6">
                                            <button
                                                onClick={resetFileUpload}
                                                className=" text-slate-300 text-opacity-60"
                                            >
                                                Cancel
                                            </button>
                                            <Button onClick={handleUpload}>
                                                Upload
                                            </Button>
                                        </div>
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
                        <FileDownloadLink downloadKey={result.downloadKey!} />
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
