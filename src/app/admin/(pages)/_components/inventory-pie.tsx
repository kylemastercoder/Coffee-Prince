"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchAllOrders } from "@/actions/orders";

// Chart configuration
const chartConfig = {
  desktop: {
    label: "Best Sellers",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const BestSellersBar = () => {
  const [chartData, setChartData] = useState<
    { productName: string; totalQuantity: number }[]
  >([]);
  const [totalProductsSold, setTotalProductsSold] = useState(0);

  useEffect(() => {
    const fetchBestSellersData = async () => {
      try {
        const orders = await fetchAllOrders();

        if (!orders || orders.length === 0) {
          console.error("No orders found.");
          return;
        }

        // Aggregate the total quantity sold per product
        const aggregatedData = orders.reduce((acc, order) => {
          const { productName, quantity } = order;
          if (!acc[productName]) {
            acc[productName] = { productName, totalQuantity: 0 };
          }
          acc[productName].totalQuantity += quantity;
          return acc;
        }, {} as Record<string, { productName: string; totalQuantity: number }>);

        // Convert aggregated data to array and sort by total quantity
        const sortedData = Object.values(aggregatedData).sort(
          (a, b) => b.totalQuantity - a.totalQuantity
        );

        // Calculate total products sold
        const total = sortedData.reduce(
          (sum, item) => sum + item.totalQuantity,
          0
        );

        setChartData(sortedData);
        setTotalProductsSold(total);
      } catch (error) {
        console.error("Failed to fetch best sellers data", error);
      }
    };

    fetchBestSellersData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Best Sellers</CardTitle>
        <CardDescription>Top products based on sales quantity</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          style={{ height: 450, width: "100%" }}
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="productName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.slice(0, 15) + (value.length > 15 ? "..." : "")
              } // Abbreviate product names
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="totalQuantity"
              fill="var(--color-desktop)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total Products Sold: {totalProductsSold}{" "}
          <ShoppingBag className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Highlighting top-selling products based on total sales quantity.
        </div>
      </CardFooter>
    </Card>
  );
};

export default BestSellersBar;
