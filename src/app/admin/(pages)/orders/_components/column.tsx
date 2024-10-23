/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";

export type OrderColumn = {
  id: string;
  orderId: string;
  fullName: string;
  productName: string;
  totalPrice: any;
  quantity: number;
  variant: string;
  flavor: string;
  status: string;
  paymentMethod: string;
  proofOfPayment: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    accessorKey: "fullName",
    header: "Customer",
  },
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => (
      <p>
        {row.original.productName} - {row.original.variant}
      </p>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      let variant:
        | "secondary"
        | "success"
        | "destructive"
        | "default"
        | "outline"
        | null
        | undefined;

      switch (row.original.status) {
        case "Pending":
          variant = "secondary";
          break;
        case "Completed":
          variant = "success";
          break;
        case "Declined":
          variant = "destructive";
          break;
        default:
          variant = "default";
      }

      return <Badge variant={variant}>{row.original.status}</Badge>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
