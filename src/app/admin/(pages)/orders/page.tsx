import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/lib/db";
import { OrderColumn } from "./_components/column";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import OrderClient from "./_components/client";

const AdminOrders = async () => {
  const orders = await db.orders.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => {
  return {
    id: order.id,
    orderId: order.orderId,
    fullName: order.name,
    productName: order.productName,
    totalPrice: formatPrice(order.totalPrice),
    quantity: order.quantity,
    createdAt: format(order.createdAt, "MMMM do, yyyy"),
    status: order.status,
    variant: order.variant,
    flavor: order.flavor,
    proofOfPayment: order.proofOfPayment ?? "",
    paymentMethod: order.paymentMethod,
  };
});

  return (
    <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-5">
      <Card className="border-0">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            Manage your orders and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderClient data={formattedOrders} />
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminOrders;
