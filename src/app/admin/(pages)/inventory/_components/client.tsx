"use client";

import React from "react";
import { InventoryColumn, columns } from "./column";
import { DataTable } from "@/components/globals/data-table";

interface InventoryClientProps {
  data: InventoryColumn[];
}

const InventoryClient: React.FC<InventoryClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default InventoryClient;
