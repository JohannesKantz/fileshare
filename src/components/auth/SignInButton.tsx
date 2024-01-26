import { signIn } from "@/lib/auth";
import React from "react";

export default function SignInButton({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <form
            action={async () => {
                "use server";
                await signIn();
            }}
        >
            {children}
        </form>
    );
}
