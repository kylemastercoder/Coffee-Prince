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
import MessageClient from "./_components/client";
import { PromoColumn } from "./_components/column";
import AddPromoModal from "@/components/modals/add-promo-modal";

const PromosDiscounts = async () => {
  const messages = await db.promos.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedPromos: PromoColumn[] = messages.map((item) => {
    return {
      id: item.id,
      name: item.name,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      code: item.code,
      description: item.description || "N/A",
      offSale: item.offSale || 0,
    };
  });

  return (
    <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-5">
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Promos and Discounts</CardTitle>
              <CardDescription>
                Manage your promos and discounts and view what&apos;s customer
                wants.
              </CardDescription>
            </div>
            <AddPromoModal />
          </div>
        </CardHeader>
        <CardContent>
          <MessageClient data={formattedPromos} />
        </CardContent>
      </Card>
    </main>
  );
};

export default PromosDiscounts;
