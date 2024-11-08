"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import SidebarAdmin from "./_components/sidebar-admin";
import HeaderAdmin from "./_components/header-admin";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Redirect to sign-in if no user is logged in
    if (!user) {
      router.push("/admin/sign-in");
      return;
    }

    // Check if user is an admin
    const isAdmin = user?.emailAddresses[0]?.emailAddress === "coffeeprinceadmin@gmail.com";
    
    if (isAdmin) {
      setIsAuthorized(true);
    } else {
      signOut({ redirectUrl: "/" });
    }
  }, [user, router, signOut]);

  // Render nothing while checking authorization status
  if (!isAuthorized) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row w-full flex-1 mx-auto",
        "h-screen"
      )}
    >
      <SidebarAdmin
        imageUrl="https://github.com/shadcn.png"
        name="Billy Joe Dela Torre"
      />
      <div className="flex w-full flex-col">
        <HeaderAdmin />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
