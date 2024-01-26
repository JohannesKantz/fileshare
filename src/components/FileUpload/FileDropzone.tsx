import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function FileDropzone({
    getRootProps,
    getInputProps,
    isDragActive,
}: {
    getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
    getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
    isDragActive: boolean;
}) {
    return (
        <>
            <Card
                {...getRootProps()}
                className={cn(
                    "flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400 p-4 text-center",
                    `${isDragActive ? "border-solid shadow-[inset_0_-2px_4px_rgba(255,255,255,0.2)]" : ""}`
                )}
            >
                <CardContent className="flex flex-col items-center justify-center gap-4">
                    {!isDragActive ? (
                        <>
                            <UploadCloudIcon className="h-12 w-12 text-gray-400" />
                            <p className="text-gray-600">
                                Drag and drop your files here
                            </p>
                            <p className="text-sm text-gray-500">or</p>
                            <div className="w-full max-w-sm items-center">
                                <Button className="border border-slate-500 bg-transparent text-slate-200 hover:bg-transparent">
                                    Select File
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p className="text-xl font-bold">
                            Drop it like it's hot!
                        </p>
                    )}

                    <input {...getInputProps()} />
                </CardContent>
            </Card>
        </>
    );
}

function UploadCloudIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="m16 16-4-4-4 4" />
        </svg>
    );
}
