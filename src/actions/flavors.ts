/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";

export const createFlavor = async (flavor: string) => {
  if (!flavor) {
    return { error: "Flavors is required" };
  }
  try {
    await db.flavors.create({
      data: {
        name: flavor,
      },
    });

    return { success: "Flavor created successfully" };
  } catch (error: any) {
    return {
      error: `Failed to create flavor. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
