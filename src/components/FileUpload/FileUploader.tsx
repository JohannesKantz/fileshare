"use client";

import React from "react";
import useFileUpload, { UploadResult } from "../../lib/useFileUpload";
import { Button } from "../ui/button";
import {
    DropEvent,
    DropzoneInputProps,
    DropzoneRootProps,
    FileRejection,
    useDropzone,
} from "react-dropzone";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { File, X } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { Progress } from "../ui/progress";
import FileDropzone from "./FileDropzone";
import FileUploadForm from "./FileUploadForm";
import { AxiosResponse } from "axios";
import { useToast } from "../ui/use-toast";

const maxFileSize = 1024 * 1024 * 1024 * 1;
const maxFileSizeString = formatFileSize(maxFileSize);

export default function FileUploader() {
    const [file, setFile] = React.useState<File>();
    const [result, setResult] = React.useState<UploadResult | undefined>(
        undefined
    );

    const { upload } = useFileUpload();
    const { toast } = useToast();

    const resetFileUpload = () => {
        setFile(undefined);
        setResult(undefined);
    };

    const onDrop = React.useCallback((acceptedFiles: any) => {
        setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize: maxFileSize,
        multiple: false,
        maxFiles: 1,
        onDropRejected: (fileRejections: FileRejection[]) => {
            if (fileRejections[0].errors[0].code === "file-too-large") {
                toast({
                    title: "File rejected",
                    description: `File is too large. Max file size is ${maxFileSizeString}.`,
                });
            } else if (fileRejections[0].errors[0].code === "too-many-files") {
                toast({
                    title: "Files rejected",
                    description: "You can only upload one file at a time.",
                });
            } else {
                toast({
                    title: "File rejected",
                    description: "An error occured while uploading the file.",
                });
            }
        },
    });

    return (
        <div className="container mx-auto h-[75dvh] w-full">
            {!!file || (!!result && !!file) ? (
                <FileUploadForm
                    {...{
                        file,
                        setFile,
                        upload,
                        resetFileUpload: resetFileUpload,
                        result,
                        setResult,
                    }}
                />
            ) : (
                <FileDropzone
                    {...{ getRootProps, getInputProps, isDragActive }}
                />
            )}
        </div>
    );
}
