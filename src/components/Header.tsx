import React from "react";
import SignInButton from "@/components/auth/SignInButton";
import Link from "next/link";
import { auth } from "@/lib/auth";
import UserAvatar from "@/components/auth/UserAvatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default async function Header({ className }: { className?: string }) {
    const session = await auth();

    return (
        <header
            className={cn("w-full border-b-2 py-4 md:border-b-0", className)}
        >
            <div className="container flex items-center justify-between">
                <div>
                    <Link href="/">
                        <h1 className="font-bold md:text-xl">
                            share.johanneskantz.com
                        </h1>
                    </Link>
                </div>
                <div>
                    {session ? (
                        <UserAvatar />
                    ) : (
                        <SignInButton>
                            <Button>Sign In</Button>
                        </SignInButton>
                    )}
                </div>
            </div>
        </header>
    );
}
