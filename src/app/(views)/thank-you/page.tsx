import BreadcrumbBanner from "@/components/globals/breadcrumb-banner";
import Navbar from "@/components/globals/landing-page/navbar";
import db from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const ThankYou = async ({ searchParams }: PageProps) => {
  const orderId = Array.isArray(searchParams.orderId)
    ? searchParams.orderId[0]
    : searchParams.orderId;

  const order = await db.orders.findMany({
    where: {
      orderId: orderId,
    },
  });
  return (
    <>
      <Navbar />
      <BreadcrumbBanner title="Thank You" image="bg3.jpg" />
      <div className="py-10 lg:px-52 md:px-20 px-10">
        <p className="text-sm font-medium text-orange-600">Order successful</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
          Thanks for ordering
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Your order was processed and your order are available to pick up once
          your order is ready.
          {order[0].userId ? (
            <span className="font-medium text-gray-100 ml-1">
              {order[0].contactNumber}
            </span>
          ) : null}
          .
        </p>
        <div className="mt-16 text-sm font-medium">
          <div className="text-muted-foreground">Order #:</div>
          <div className="mt-2 text-gray-100">{order[0].orderId}</div>

          <ul className="mt-6 divide-y divide-gray-800 border-t border-gray-800 text-sm font-medium text-muted-foreground">
            {order?.map((product) => {
              return (
                <li key={product.id} className="flex space-x-6 py-6">
                  <div className="flex-auto flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="text-gray-100">{product.productName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.quantity} pc/s
                      </p>
                    </div>
                  </div>

                  <p className="flex-none font-medium text-gray-100">
                    {product.variant} - {product.flavor}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="space-y-6 border-t border-gray-800 pt-6 text-sm font-medium text-muted-foreground">
            <div className="flex justify-between">
              <p>Shipping Fee</p>
              <p className="text-gray-100">N/A</p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-800 pt-6 text-gray-100">
              <p className="text-base">Total</p>
              <p className="text-base">
                {formatPrice(Number(order[0].totalPrice))}
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-gray-800 py-6 text-right">
            <Link
              href="/menu"
              className="text-sm font-medium text-orange-600 hover:text-orange-500"
            >
              Continue shopping &rarr;
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYou;
