"use client";

import React from "react";
import { OrderColumn, columns } from "./column";
import { DataTable } from "@/components/globals/data-table";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default OrderClient;
