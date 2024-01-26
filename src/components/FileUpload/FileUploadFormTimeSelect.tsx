"use client";
import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { on } from "events";

export default function FileUploadFormTimeSelect({
    options,
    defaultDeleteAfter,
    onChange,
}: {
    options: Array<{ value: string; label: string }>;
    defaultDeleteAfter: number;
    onChange?: (value: string) => void;
}) {
    const session = useSession();

    return (
        <div>
            <Label>Delete after</Label>
            <Select
                defaultValue={options[defaultDeleteAfter].value}
                disabled={session.status !== "authenticated"}
                onValueChange={onChange}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
