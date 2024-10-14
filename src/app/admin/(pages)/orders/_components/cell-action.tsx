/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Button } from "@/components/ui/button";
import { OrderColumn } from "./column";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCheckIcon, Image, MoreHorizontal, Trash, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AlertModal from "@/components/globals/alert-modal";
import ProofModal from "@/components/modals/proof-modal";
import ApproveModal from "@/components/modals/approve-modal";
import RejectModal from "@/components/modals/reject-modal";
import { approveOrder, deleteOrder, rejectOrder } from "@/actions/orders";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [proofOpen, setProofOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const onDelete = async () => {
    setIsLoading(true);
    deleteOrder(data.id)
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.refresh();
        } else {
          toast.error(data.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onApprove = async () => {
    setIsLoading(true);
    approveOrder(data.id, data.quantity)
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.refresh();
          setApproveOpen(false);
        } else {
          toast.error(data.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onReject = async () => {
    setIsLoading(true);
    rejectOrder(data.id)
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.refresh();
          setRejectOpen(false);
        } else {
          toast.error(data.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isLoading}
        onConfirm={onDelete}
      />
      <ProofModal
        image={data.proofOfPayment}
        isOpen={proofOpen}
        loading={isLoading}
        onClose={() => setProofOpen(false)}
      />
      <ApproveModal
        isOpen={approveOpen}
        loading={isLoading}
        onClose={() => setApproveOpen(false)}
        onConfirm={onApprove}
      />
      <RejectModal
        isOpen={rejectOpen}
        loading={isLoading}
        onClose={() => setRejectOpen(false)}
        onConfirm={onReject}
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
          {data.status === "Pending" && (
            <>
              <DropdownMenuItem onClick={() => setApproveOpen(true)}>
                <CheckCheckIcon className="w-4 h-4 mr-2" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRejectOpen(true)}>
                <X className="w-4 h-4 mr-2" />
                Reject
              </DropdownMenuItem>
            </>
          )}
          {data.proofOfPayment && (
            <DropdownMenuItem onClick={() => setProofOpen(true)}>
              <Image className="w-4 h-4 mr-2" />
              View Proof
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
