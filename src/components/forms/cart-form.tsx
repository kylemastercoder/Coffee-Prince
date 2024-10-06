"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Categories, Flavors, Menus, Variants } from "@prisma/client";
import useCart from "@/hooks/use-cart";
import { toast } from "sonner";

interface MenuWithFeatures extends Menus {
  category: Categories;
  variants: Variants[];
  flavors: Flavors[];
}

const CartForm = ({ menu }: { menu: MenuWithFeatures }) => {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const addToCart = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedFlavor) {
      return toast.error("Please select a variant and flavors.");
    }

    const selectedVariantData = menu?.variants.find(
      (v) => v.name === selectedVariant
    );

    addToCart({
      id: menu?.id as string,
      name: menu?.name as string,
      price: selectedVariantData?.price ?? 0,
      quantity,
      flavor: selectedFlavor,
      variant: selectedVariant,
      image: menu?.image as string,
      description: menu?.description as string,
    });
  };

  return (
    <div className="grid grid-cols-5 mx-auto px-52 gap-20 py-10">
      <div className="col-span-2">
        <Badge variant="secondary">{menu?.category.name}</Badge>
        <p className="text-4xl font-bold mt-2">{menu?.name}</p>
        <p className="text-muted-foreground mt-1">{menu?.description}</p>
        <p className="text-xl font-bold mt-5">Variants: </p>
        <RadioGroup
          className="flex items-center space-x-2 mt-2"
          onValueChange={(value) => setSelectedVariant(value)}
        >
          {menu?.variants.map((item) => (
            <div
              key={item.id}
              className="flex border py-3 rounded-lg border-orange-500 px-2 items-center space-x-2"
            >
              <RadioGroupItem value={item.name} id={item.name} />
              <Label htmlFor={item.name}>
                {item.name} - {formatPrice(Number(item.price))}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <p className="text-xl font-bold mt-5">Flavors: </p>
        <RadioGroup
          onValueChange={(value) => setSelectedFlavor(value)}
          className="flex items-center space-x-2 mt-2"
        >
          {menu?.flavors.map((item) => (
            <div
              key={item.id}
              className="flex border py-3 rounded-lg border-orange-500 px-2 items-center space-x-2"
            >
              <RadioGroupItem value={item.name} id={item.name} />
              <Label htmlFor={item.name}>{item.name}</Label>
            </div>
          ))}
        </RadioGroup>
        <div className="flex items-center mt-10 gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              <MinusIcon />
            </Button>
            <Input value={quantity} readOnly className="w-20 text-center" />
            <Button
              size="icon"
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
            >
              <PlusIcon />
            </Button>
          </div>
          {menu?.stocks === 0 ? (
            <Button variant="destructive" disabled>
              Out of Stock
            </Button>
          ) : (
            <Button onClick={handleAddToCart}>Add To Cart</Button>
          )}
        </div>
      </div>
      <div className="col-span-3 relative w-full h-[700px]">
        <Image
          src={menu?.image as string}
          alt="Image"
          fill
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default CartForm;
