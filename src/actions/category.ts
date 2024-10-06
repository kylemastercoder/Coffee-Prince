/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";

export const createCatergory = async (category: string) => {
  if (!category) {
    return { error: "Category is required" };
  }
  try {
    await db.categories.create({
      data: {
        name: category,
      },
    });

    return { success: "Category created successfully" };
  } catch (error: any) {
    return {
      error: `Failed to create category. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const getAllCategories = async () => {
  const categories = await db.categories.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return categories;
};
