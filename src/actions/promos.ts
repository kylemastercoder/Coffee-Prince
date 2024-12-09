/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";

export const createPromos = async (data: {
  name: string;
  code: string;
  description: string;
  offSale: string;
}) => {
  const { name, code, description, offSale } = data;

  if (!name || !code || !offSale) {
    return { error: "All fields are required." };
  }

  try {
    await db.promos.create({
      data: {
        name,
        code,
        description,
        offSale: parseFloat(offSale), // Ensure offSale is stored as a number
      },
    });

    return { success: "Promo created successfully." };
  } catch (error: any) {
    return {
      error: `Failed to create promo. Please try again. ${error.message || ""}`,
    };
  }
};

export const getPromos = async () => {
  try {
    const promos = await db.promos.findMany(); // Adjust for your database model

    return { promos };
  } catch (error: any) {
    return {
      error: `Failed to fetch promos. Please try again. ${error.message || ""}`,
    };
  }
};
