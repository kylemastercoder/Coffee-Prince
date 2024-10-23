
import { cn } from "@/lib/utils";
import React from "react";
import SidebarAdmin from "./_components/sidebar-admin";
import HeaderAdmin from "./_components/header-admin";


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row  w-full flex-1 mx-auto",
        "h-screen"
      )}
    >
      <SidebarAdmin imageUrl="https://github.com/shadcn.png" name="Billy Joe Dela Torre" />
      <div className="flex w-full flex-col">
        <HeaderAdmin />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
