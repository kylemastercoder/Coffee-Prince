"use client";

import React from "react";
import { MessageColumn, columns } from "./column";
import { DataTable } from "@/components/globals/data-table";

interface MessageClientProps {
  data: MessageColumn[];
}

const MessageClient: React.FC<MessageClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default MessageClient;
