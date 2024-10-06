"use client";

import React from "react";
import Navbar from "@/components/globals/landing-page/navbar";
import useCart from "@/hooks/use-cart";
import CartItem from "@/components/globals/cart-item";
import CartSummary from "@/components/globals/cart-summary";

const CartPage = () => {
  const cart = useCart();
  return (
    <>
      <Navbar />
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">Shopping Cart ({cart.items.length})</h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
          <div className="lg:col-span-7">
            {cart.items.length === 0 && (
              <p className="text-muted-foreground font-semibold">
                No items added to cart
              </p>
            )}
            <ul>
              {cart.items.map((item) => (
                <CartItem key={item.id} data={item} />
              ))}
            </ul>
          </div>
          <CartSummary />
        </div>
      </div>
    </>
  );
};

export default CartPage;
