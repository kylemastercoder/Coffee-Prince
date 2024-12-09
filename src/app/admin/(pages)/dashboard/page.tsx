import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Wallet } from "lucide-react";
import React from "react";
import SalesBar from "../_components/sales-bar";
import InventoryPie from "../_components/inventory-pie";

const getStartDates = () => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0); // Set time to midnight
  startOfWeek.setDate(now.getDate() - now.getDay()); // Last Sunday

  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7); // Last week

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
  startOfMonth.setHours(0, 0, 0, 0); // Set to midnight

  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // First day of last month
  startOfLastMonth.setHours(0, 0, 0, 0); // Set to midnight

  return { startOfWeek, startOfLastWeek, startOfMonth, startOfLastMonth };
};

const AdminDashboard = async () => {
  const orders = await db.orders.findMany({
    where: {
      status: "Completed",
    },
  });

  const { startOfWeek, startOfLastWeek, startOfMonth, startOfLastMonth } =
    getStartDates();

  // Calculate total sales for this week
  const salesThisWeek = orders.reduce((total, order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= startOfWeek ? total + order.totalPrice : total;
  }, 0);

  // Calculate total sales for last week
  const salesLastWeek = orders.reduce((total, order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= startOfLastWeek && createdAt < startOfWeek
      ? total + order.totalPrice
      : total;
  }, 0);

  // Calculate total sales for this month
  const salesThisMonth = orders.reduce((total, order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= startOfMonth ? total + order.totalPrice : total;
  }, 0);

  // Calculate total sales for last month
  const salesLastMonth = orders.reduce((total, order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= startOfLastMonth && createdAt < startOfMonth
      ? total + order.totalPrice
      : total;
  }, 0);

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100.0%" : "0.0%"; // Handle zero case
    return `${(((current - previous) / previous) * 100).toFixed(1)}%`;
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(salesThisWeek)}
            </div>
            <p className="text-xs text-muted-foreground">
              {getPercentageChange(salesThisWeek, salesLastWeek)} from last week
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(salesThisMonth)}
            </div>
            <p className="text-xs text-muted-foreground">
              {getPercentageChange(salesThisMonth, salesLastMonth)} from last
              month
            </p>
          </CardContent>
        </Card>
      </div>
      <SalesBar />
      <InventoryPie />
    </main>
  );
};

export default AdminDashboard;
