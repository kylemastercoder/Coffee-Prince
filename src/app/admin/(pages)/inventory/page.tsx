import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/lib/db";
import { format } from "date-fns";
import { IngredientsColumn, InventoryColumn } from "./_components/column";
import InventoryClient from "./_components/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IngredientsClient from "./_components/ingredients-client";

const AdminInventory = async () => {
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

  const ingredients = await db.ingredients.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedInventory: InventoryColumn[] = menus.map((menu) => {
    return {
      id: menu.id,
      name: menu.name,
      createdAt: format(menu.createdAt, "MMMM do, yyyy"),
      category: menu.category.name,
      imageUrl: menu.image,
      stocks: menu.stocks,
    };
  });

  const formattedIngredients: IngredientsColumn[] = ingredients.map((menu) => {
    return {
      id: menu.id,
      name: menu.name,
      createdAt: format(menu.createdAt, "MMMM do, yyyy"),
      stocks: menu.stocks,
    };
  });

  return (
    <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-5">
      <Card className="border-0">
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>
            Manage your stocks and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="menus">
            <TabsList>
              <TabsTrigger value="menus">Menus Inventory</TabsTrigger>
              <TabsTrigger value="ingredients">
                Ingredients Inventory
              </TabsTrigger>
            </TabsList>
            <TabsContent value="menus">
              <InventoryClient data={formattedInventory} />
            </TabsContent>
            <TabsContent value="ingredients">
              <IngredientsClient data={formattedIngredients} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminInventory;
