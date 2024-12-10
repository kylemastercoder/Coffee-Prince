/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";

export const createPaymentMethod = async (data: {
  name: string;
  image: string;
}) => {
  const { name, image } = data;

  if (!image) {
    return { error: "All fields are required." };
  }

  try {
    await db.paymentMethod.create({
      data: {
        name,
        image,
      },
    });

    return { success: "Payment method created successfully." };
  } catch (error: any) {
    return {
      error: `Failed to create payment method. Please try again. ${error.message || ""}`,
    };
  }
};

export const updatePaymentMethod = async (data: {
  name: string;
  image: string;
}, id: string) => {
  const { name, image } = data;

  if (!image) {
    return { error: "All fields are required." };
  }

  try {
    await db.paymentMethod.update({
      where: {
        id
      },
      data: {
        name,
        image,
      },
    });

    return { success: "Payment method updated successfully." };
  } catch (error: any) {
    return {
      error: `Failed to update payment method. Please try again. ${error.message || ""}`,
    };
  }
};

export const getPaymentMethod = async () => {
  try {
    const paymentMethod = await db.paymentMethod.findMany(); 

    return { paymentMethod };
  } catch (error: any) {
    return {
      error: `Failed to fetch payment method. Please try again. ${error.message || ""}`,
    };
  }
};
