"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

function Header() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleDashboardClick = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      toast.warning("Please sign in first to access the dashboard!");
    }
  };

  return (
    <header className="p-4 flex justify-between items-center bg-gradient-to-r from-blue-800 via-gray-800 to-black shadow-md">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Expensify Logo"
          width={80}
          height={40}
          className="object-contain cursor-pointer"
        />
      </Link>
      <div className="flex gap-4">
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Link href="/sign-in">
            <Button className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 transition-all duration-200">
              Get Started
            </Button>
          </Link>
        )}
        <Button
          onClick={handleDashboardClick}
          className="px-6 py-2 text-white bg-gray-700 hover:bg-gray-800 transition-all duration-200"
        >
          Go to Dashboard
        </Button>
      </div>
    </header>
  );
}

export default Header;
