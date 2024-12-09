"use client";

import React from "react";
import { PromoColumn, columns } from "./column";
import { DataTable } from "@/components/globals/data-table";

interface PromoClientProps {
  data: PromoColumn[];
}

const PromoClient: React.FC<PromoClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default PromoClient;
