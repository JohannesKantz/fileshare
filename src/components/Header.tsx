import React from "react";
import SignInButton from "@/components/auth/SignInButton";
import Link from "next/link";
import { auth } from "@/lib/auth";
import UserAvatar from "@/components/auth/UserAvatar";
import { Button } from "./ui/button";

export default async function Header() {
    const session = await auth();

    return (
        <header className="container flex justify-between py-5">
            <div>
                <Link href="/">
                    <h1 className="text-xl font-bold">
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
        </header>
    );
}
