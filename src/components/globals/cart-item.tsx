"use client";

import { MinusIcon, PlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import useCart from "@/hooks/use-cart";

interface CartProps {
  id: string;
  image: string;
  flavor: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  variant: string;
}

const CartItem = ({ data }: { data: CartProps }) => {
  const cart = useCart();
  const onRemoveCart = () => {
    cart.removeItem(data.id);
  };

  const incrementQuantity = () => {
    cart.updateQuantity(data.id, data.quantity + 1);
  };

  const decrementQuantity = () => {
    if (data.quantity > 1) {
      cart.updateQuantity(data.id, data.quantity - 1);
    }
  };
  return (
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:w-48 sm:h-48">
        <Image
          fill
          src={data?.image}
          alt="Image"
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <Button onClick={onRemoveCart}>
            <Trash className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <div>
              <p className="text-lg font-semibold">
                {data?.name} <Badge variant="secondary">{data?.variant}</Badge>
              </p>
              <Badge variant="outline" className="inline-flex mt-2">
                {data?.flavor}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-5">
                {data?.description}
              </p>
            </div>
          </div>
          <p>{formatPrice(data?.price * data.quantity)}</p>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={decrementQuantity}>
              <MinusIcon />
            </Button>
            <Input
              value={data.quantity}
              readOnly
              className="w-20 text-center"
            />
            <Button size="icon" variant="outline" onClick={incrementQuantity}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
