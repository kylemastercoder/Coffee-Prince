"use client";

import { Button } from "@/components/ui/button";
import { InventoryColumn } from "./column";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StockModal from "@/components/modals/stock-modal";
import { updateStock } from "@/actions/menu";

interface CellActionProps {
  data: InventoryColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onUpdateStock = async (newStock: number) => {
    setIsLoading(true);
    try {
      const response = await updateStock(data.id, newStock);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.success);
        router.refresh();
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update stock. Please try again.");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <StockModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isLoading}
        onConfirm={onUpdateStock}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Add Stock
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
