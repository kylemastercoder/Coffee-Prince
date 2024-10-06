"use client";

import React from "react";
import { Button } from "../ui/button";
import useCart from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";

const CartSummary = () => {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="mt-16 rounded-lg bg-zinc-900 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Order Summary</h2>
        <Button onClick={removeAll} variant="destructive" size="sm">
          Remove All
        </Button>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-700 pt-4">
          <div className="text-base font-medium text-muted-foreground">
            Order Item/s
          </div>
          <p>{totalQuantity} pc/s</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-base font-medium text-muted-foreground">
            Shipping Fee
          </div>
          <Badge variant="secondary">Not Assigned</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-base font-medium text-muted-foreground">
            Order Total
          </div>
          <p>{formatPrice(totalPrice)}</p>
        </div>
      </div>
      <Button disabled={items.length === 0} onClick={() => router.push("/checkout")} className="w-full mt-6">
        Checkout
      </Button>
    </div>
  );
};

export default CartSummary;
