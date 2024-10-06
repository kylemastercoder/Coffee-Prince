"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

const HeaderAdmin = () => {
  const pathname = usePathname();
  // Split the pathname into segments and filter out 'admin'
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "admin");

  // Helper function to format path segment
  const formatSegment = (segment: string) => {
    // Capitalize the first letter and replace hyphens with spaces
    return (
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
    );
  };

  // Helper function to determine the breadcrumb label for the last segment
  const getLastSegmentLabel = () => {
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment === "new") {
      // Check if the parent route is 'menus' or 'customers' for adding
      const parentSegment = pathSegments[pathSegments.length - 2];
      if (parentSegment === "menus") return "Add Menu";
      if (parentSegment === "customers") return "Add Customer";
    }

    // If it's not "new", check if it's an ID (e.g., alphanumeric)
    const idRegex = /^[a-zA-Z0-9]+$/;
    if (idRegex.test(lastSegment)) {
      // Check if the parent route is 'menus' or 'customers' for updating
      const parentSegment = pathSegments[pathSegments.length - 2];
      if (parentSegment === "menus") return "Update Menu";
      if (parentSegment === "customers") return "Update Customer";
    }

    // Default to the formatted segment
    return formatSegment(lastSegment);
  };

  return (
    <div className="flex items-center justify-between py-3 px-5">
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {pathname !== "/admin/dashboard" && (
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          {pathSegments.map((segment, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {/* Make the last segment a page indicator */}
                {index === pathSegments.length - 1 ? (
                  <BreadcrumbPage>{getLastSegmentLabel()}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/${[
                        "admin",
                        ...pathSegments.slice(0, index + 1),
                      ].join("/")}`}
                    >
                      {formatSegment(segment)}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative md:block hidden mt-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
    </div>
  );
};

export default HeaderAdmin;
