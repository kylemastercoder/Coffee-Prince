/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export type InventoryColumn = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  stocks: number;
  createdAt: string;
};

export const columns: ColumnDef<InventoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Menu",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.imageUrl ? (
          <Image
            src={row.original.imageUrl}
            alt="Image"
            width={40}
            height={40}
            className="object-cover rounded-md"
          />
        ) : (
          <Avatar className="w-10 h-10 object-cover rounded-md">
            <AvatarFallback className="rounded-md">
              {row.original.name}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col">
          <p className="font-semibold">{row.original.name}</p>
          <p className="text-muted-foreground text-sm">
            {row.original.category}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "stocks",
    header: "Stocks",
  },
  {
    header: "Status",
    cell: ({ row }) => {
      return <Badge variant={row.original.stocks === 0 ? "destructive" : "success"}>{row.original.stocks === 0 ? "Out of Stock" : "In Stock"}</Badge>;
    },
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
