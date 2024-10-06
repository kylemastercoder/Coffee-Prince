/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { CheckoutFormValidation } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  flavor: string;
  variant: string;
  description: string;
}

const generateOrderId = () => {
  const timestamp = Date.now().toString(36); // Convert timestamp to base 36
  const randomStr = Math.random().toString(36).substring(2, 8); // Generate a random string
  return `ORD-${timestamp}-${randomStr}`; // Concatenate to create a unique order ID
};

export const placeOrder = async (
  values: z.infer<typeof CheckoutFormValidation>,
  selectedPaymentMethod: string,
  items: CartItem[],
  fullName: string
) => {
  const { userId } = auth();

  if (!userId)
    return { message: "You need to sign in to place an order.", error: true };

  const validatedField = CheckoutFormValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    address,
    municipality,
    province,
    barangay,
    region,
    contactNumber,
    proofOfPayment,
  } = validatedField.data;

  try {
    const orderId = generateOrderId();
    const completeAddress = `${address}, ${barangay}, ${municipality}, ${province}, ${region}`;

    await Promise.all(
      items.map((item) =>
        db.orders.create({
          data: {
            name: fullName,
            menuId: item.id,
            orderId: orderId,
            userId: userId,
            address: completeAddress,
            contactNumber: contactNumber,
            flavor: item.flavor,
            productName: item.name,
            variant: item.variant,
            totalPrice: item.quantity * item.price,
            quantity: item.quantity,
            paymentMethod: selectedPaymentMethod,
            proofOfPayment: proofOfPayment ?? "",
          },
        })
      )
    );

    return { success: "Order placed successfully", orderId };
  } catch (error: any) {
    console.error("Error placing order:", error);
    return {
      error: `Failed to place order. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteOrder = async (orderId: string) => {
  if (!orderId) {
    return { error: "Order ID is required" };
  }

  try {
    const order = await db.orders.delete({
      where: {
        id: orderId,
      },
    });

    return { success: "Order deleted successfully", order };
  } catch (error: any) {
    return {
      error: `Failed to delete order. Please try again. ${error.message || ""}`,
    };
  }
};

export const approveOrder = async (orderId: string, quantity: number) => {
  if (!orderId) {
    return { error: "Order ID is required" };
  }

  try {
    const order = await db.orders.update({
      data: {
        status: "Completed",
      },
      where: {
        id: orderId,
      },
    });

    const menu = await db.menus.findFirst({
      where: {
        id: order.menuId,
      },
    });

    if (!menu) {
      return { error: "Menu not found" };
    }

    const newStock = menu.stocks - quantity;

    if (newStock < 0) {
      return { error: "Insufficient stock available" };
    }

    await db.menus.update({
      data: {
        stocks: newStock,
      },
      where: {
        id: order.menuId,
      },
    });

    return { success: "Order approved successfully", order };
  } catch (error: any) {
    return {
      error: `Failed to approve order. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const rejectOrder = async (orderId: string) => {
  if (!orderId) {
    return { error: "Order ID is required" };
  }

  try {
    const order = await db.orders.update({
      data: {
        status: "Declined",
      },
      where: {
        id: orderId,
      },
    });

    return { success: "Order rejected successfully", order };
  } catch (error: any) {
    return {
      error: `Failed to reject order. Please try again. ${error.message || ""}`,
    };
  }
};
