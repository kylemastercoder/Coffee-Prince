/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export type MenuColumn = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: unknown;
  imageUrl: string;
  flavors: unknown;
  featured: string;
  createdAt: string;
};

export const columns: ColumnDef<MenuColumn>[] = [
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
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const [isExpanded, setIsExpanded] = useState(false);
      return (
        <div>
          <p className="mb-2">
            {isExpanded
              ? row.original.description
              : `${row.original.description.slice(0, 80)}${
                  row.original.description.length > 80 ? "..." : ""
                }`}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "flavors",
    header: "Flavors",
  },
  {
    accessorKey: "featured",
    header: "Featured",
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
