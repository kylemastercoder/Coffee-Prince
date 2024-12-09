/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";

export type PromoColumn = {
  id: string;
  name: string;
  description: string;
  code: string;
  offSale: number;
  createdAt: string;
};

export const columns: ColumnDef<PromoColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "offSale",
    header: "Off Sale",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
];
