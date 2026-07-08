"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";

import { Button } from "@/src/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight">
          True Feedback
        </Link>

        {session ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Welcome, {user?.username ?? user?.email}
            </span>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
