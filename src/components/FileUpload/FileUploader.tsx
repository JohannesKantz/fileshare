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

export default function FileUploader() {
    const [file, setFile] = React.useState<File>();
    const [result, setResult] = React.useState<UploadResult | undefined>(
        undefined
    );

    const { upload } = useFileUpload();

    const resetFileUpload = () => {
        setFile(undefined);
        setResult(undefined);
    };

    const onDrop = React.useCallback((acceptedFiles: any) => {
        console.log({ acceptedFiles });
        setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
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
