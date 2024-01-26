"use client";

import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";

export default function downloadLink({ downloadKey }: { downloadKey: string }) {
    const downloadURL = `/${downloadKey}`;
    const fullURL = window.location.origin + downloadURL;

    const { toast } = useToast();

    function handleCopy() {
        navigator.clipboard.writeText(fullURL);
        toast({
            title: "Copied",
            description: "Download link copied to clipboard",
        });
    }

    return (
        <div className="flex items-center justify-start gap-4">
            <a href={downloadURL} className="underline">
                {fullURL}
            </a>
            <Copy onClick={handleCopy} className="w-4 cursor-pointer" />
        </div>
    );
}
