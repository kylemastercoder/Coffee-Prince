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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminMenus = async () => {
  const menus = await db.menus.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      isArchive: false,
    },
    include: {
      category: true,
      variants: true,
      flavors: true,
    },
  });

  const menusArchive = await db.menus.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      isArchive: true,
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

  const formattedMenuArchive: MenuColumn[] = menusArchive.map((item) => {
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
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Menus</TabsTrigger>
              <TabsTrigger value="archive">Archived Menus</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <MenuClient data={formattedMenu} />
            </TabsContent>
            <TabsContent value="archive">
              <MenuClient data={formattedMenuArchive} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminMenus;
