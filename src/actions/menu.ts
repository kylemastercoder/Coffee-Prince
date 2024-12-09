/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { MenuFormValidation } from "@/lib/validators";
import { Categories, Flavors, Menus, Variants } from "@prisma/client";
import { z } from "zod";

interface MenuWithCategory extends Menus {
  category: Categories;
  variants: Variants[];
  flavors: Flavors[];
}

export const createMenu = async (
  values: z.infer<typeof MenuFormValidation>
) => {
  const validatedField = MenuFormValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    description,
    category,
    stocks,
    imageUrl,
    featured,
    flavors,
    variants,
  } = validatedField.data;

  try {
    const menu = await db.menus.create({
      data: {
        name,
        description,
        categoryId: category,
        image: imageUrl,
        stocks,
        featured,
        flavors: {
          connectOrCreate: flavors.map((flavor) => ({
            where: { id: flavor },
            create: { name: flavor },
          })),
        },
        variants: {
          create: variants.map((variant) => ({
            name: variant.name,
            price: variant.price,
          })),
        },
      },
    });

    return { success: "Menu created successfully", menu };
  } catch (error: any) {
    return {
      error: `Failed to create menu. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteMenu = async (menuId: string) => {
  if (!menuId) {
    return { error: "Menu ID is required" };
  }

  try {
    const menu = await db.menus.update({
      where: {
        id: menuId,
      },
      data: {
        isArchive: true,
      },
    });

    return { success: "Menu archived successfully", menu };
  } catch (error: any) {
    return {
      error: `Failed to archive menu. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteVariant = async (variantId: string) => {
  if (!variantId) {
    return { error: "Variant ID is required" };
  }

  try {
    const variant = await db.variants.delete({
      where: {
        id: variantId,
      },
    });

    return { success: "Variant deleted successfully", variant };
  } catch (error: any) {
    return {
      error: `Failed to delete variant. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const getFeaturedMenus = async (): Promise<
  Record<string, MenuWithCategory[]>
> => {
  const menus: MenuWithCategory[] = await db.menus.findMany({
    where: {
      featured: "Yes",
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      flavors: true,
      variants: true,
      category: true,
    },
  });

  // Group the menus by their category
  const groupedMenus = menus.reduce<Record<string, MenuWithCategory[]>>(
    (acc, menu) => {
      const category = menu.category.name;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(menu);
      return acc;
    },
    {}
  );

  return groupedMenus;
};

export const getMenus = async (menuId: string): Promise<MenuWithCategory[]> => {
  const menu = await db.menus.findUnique({
    where: {
      id: menuId,
    },
    include: {
      flavors: true,
      variants: true,
      category: true,
    },
  });

  if (!menu) {
    return [];
  }

  return [menu];
};

export const getAllMenus = async () => {
  const menus = await db.menus.findMany({
    include: {
      variants: true,
      flavors: true,
      category: true,
    },
  });

  return menus;
};

export const updateStock = async (menuId: string, newStock: number) => {
  if (!menuId) {
    return { error: "Menu ID is required" };
  }

  try {
    // Retrieve the current stock first
    const currentMenu = await db.menus.findUnique({
      where: { id: menuId },
      select: { stocks: true }, // Select only the stocks field
    });

    if (!currentMenu) {
      return { error: "Menu item not found" };
    }

    const currentStock = currentMenu.stocks;

    // Update the stock
    const updatedMenu = await db.menus.update({
      data: {
        stocks: newStock + currentStock,
      },
      where: {
        id: menuId,
      },
    });

    // Return success message along with current and new stock values
    return {
      success: "Stock updated successfully",
      menu: updatedMenu,
    };
  } catch (error: any) {
    return {
      error: `Failed to update stock. Please try again. ${error.message || ""}`,
    };
  }
};

export const addIngredients = async (stock: number, name: string) => {
  if (!stock || !name) {
    return { error: "Please fill all required fields" };
  }

  try {
    // Retrieve the current stock first
    const ingredients = await db.ingredients.create({
      data: {
        stocks: stock,
        name,
      },
    });

    if (!ingredients) {
      return { error: "Ingredient not added" };
    }

    return {
      success: "Ingredient added successfully",
      ingredients: ingredients,
    };
  } catch (error: any) {
    return {
      error: `Failed to add ingredient. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
