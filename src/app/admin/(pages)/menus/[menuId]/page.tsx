import React from "react";
import db from "@/lib/db";
import MenuForm from "@/components/forms/menu-form";

const MenuPage = async ({ params }: { params: { menuId: string } }) => {
  const menu = await db.menus.findUnique({
    where: {
      id: params.menuId,
    },
    include: {
      category: true,
      variants: true,
      flavors: true,
    },
  });

  const categories = await db.categories.findMany();
  const categoriesOptions = categories.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const flavors = await db.flavors.findMany();
  const flavorsOptions = flavors.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <div className="flex-1 space-y-2 px-8 pt-2 pb-4">
      <MenuForm
        initialData={menu}
        categories={categoriesOptions}
        flavors={flavorsOptions}
      />
    </div>
  );
};

export default MenuPage;
