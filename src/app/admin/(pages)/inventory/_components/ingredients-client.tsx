"use client";

import React from "react";
import { IngredientsColumn, columnsIngredients } from "./column";
import { DataTable } from "@/components/globals/data-table";
import { Button } from "@/components/ui/button";
import IngredientsModal from "@/components/modals/ingredients-modal";

interface IngredientsClientProps {
  data: IngredientsColumn[];
}

const IngredientsClient: React.FC<IngredientsClientProps> = ({ data }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
    <IngredientsModal isOpen={open} onClose={() => setOpen(false)} />
      <Button size="sm" className="float-right" onClick={() => setOpen(true)}>
        + Add Ingredients
      </Button>
      <DataTable searchKey="name" columns={columnsIngredients} data={data} />
    </>
  );
};

export default IngredientsClient;
