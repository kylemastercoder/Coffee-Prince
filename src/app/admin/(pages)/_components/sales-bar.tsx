"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
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
import { fetchSalesByMonth } from "@/actions/orders";
import { formatPrice } from "@/lib/utils";

// Define all months
const allMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartConfig = {
  desktop: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const SalesBar = () => {
  const [chartData, setChartData] = useState<
    { month: string; sales: number }[]
  >([]);
  const [totalOrders, setTotalOrders] = useState("0.00");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const data = await fetchSalesByMonth(); // Fetch data from the database

        // Map through all months and add sales data where it exists, otherwise set sales to 0
        const salesData = allMonths.map((month) => {
          const dataForMonth = data?.find((item) => item.month === month);
          return { month, sales: dataForMonth ? dataForMonth.sales : 0 };
        });

        // Calculate the total orders (sum of all sales)
        const totalSales = salesData.reduce((acc, curr) => acc + curr.sales, 0);
        const formattedTotalSales = formatPrice(totalSales, {
          notation: "standard",
        });

        setChartData(salesData);
        setTotalOrders(formattedTotalSales);
      } catch (error) {
        console.error("Failed to fetch sales data", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Sales Summary</CardTitle>
        <CardDescription>January - December 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer style={{height: 450, width: '100%'}} config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} // Abbreviate month names
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="sales" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total Sales: {totalOrders} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales for the year 2024
        </div>
      </CardFooter>
    </Card>
  );
};

export default SalesBar;
