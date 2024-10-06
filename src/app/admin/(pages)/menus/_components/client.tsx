"use client";

import React from "react";
import { MenuColumn, columns } from "./column";
import { DataTable } from "@/components/globals/data-table";

interface MenuClientProps {
  data: MenuColumn[];
}

const MenuClient: React.FC<MenuClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default MenuClient;
