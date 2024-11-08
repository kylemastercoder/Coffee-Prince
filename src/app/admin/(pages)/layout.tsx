"use client";

import { cn } from "@/lib/utils";
import React from "react";
import SidebarAdmin from "./_components/sidebar-admin";
import HeaderAdmin from "./_components/header-admin";
import { useClerk, useUser } from "@clerk/nextjs";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  if (!user) {
    window.location.assign("/admin/sign-in");
  }

  if (user?.emailAddresses[0].emailAddress === "coffeeprinceadmin@gmail.com") {
    window.location.assign("/admin/dashboard");
  } else {
    signOut({ redirectUrl: "/" });
  }

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row  w-full flex-1 mx-auto",
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
