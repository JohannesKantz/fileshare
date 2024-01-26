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
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import SignInButton from "../auth/SignInButton";
import ClientOnly from "../ClientOnly";
import { signIn } from "@/lib/auth";

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
            <HoverCard
                openDelay={session.status !== "authenticated" ? 1 : 10e8}
            >
                <HoverCardTrigger>
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
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </HoverCardTrigger>
                <HoverCardContent>
                    <span className="font-bold">Sign in</span> to select a
                    custom expiration time.
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}
