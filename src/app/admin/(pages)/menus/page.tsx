import React from "react";
import TableHeader from "../_components/table-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/lib/db";
import MenuClient from "./_components/client";
import { MenuColumn } from "./_components/column";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";

const AdminMenus = async () => {
  const menus = await db.menus.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      variants: true,
      flavors: true,
    },
  });

  const formattedMenu: MenuColumn[] = menus.map((item) => {
    // Format variants and flavors
    const variantDetails = item.variants
      .map(
        (variant) => `${formatPrice(Number(variant.price))} (${variant.name})`
      )
      .join(" | ");

    const flavorDetails = item.flavors.map((flavor) => flavor.name).join(", ");

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.image,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      price: variantDetails,
      flavors: flavorDetails,
      featured: item.featured ? "Yes" : "No",
      category: item.category.name,
    };
  });
  return (
    <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-5">
      <TableHeader label="Add Menu" href="/admin/menus/new" />
      <Card className="border-0">
        <CardHeader>
          <CardTitle>Menus</CardTitle>
          <CardDescription>
            Manage your menus and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MenuClient data={formattedMenu} />
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminMenus;
