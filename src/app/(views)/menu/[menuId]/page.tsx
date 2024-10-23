import db from "@/lib/db";
import React from "react";
import Banner from "@/components/globals/banner";
import MenuContainer from "@/components/globals/menu-container";
import Navbar from "@/components/globals/landing-page/navbar";
import CartForm from "@/components/forms/cart-form";

const ViewMenu = async ({ params }: { params: { menuId: string } }) => {
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
  return (
    <>
      <Navbar />
      <Banner image={menu?.image as string} title={menu?.name as string} />
      {menu && <CartForm menu={menu} />}
      <div className="md:px-52 px-10 gap-20 py-10">
        <p className="text-3xl font-bold">Related Products </p>
        {menu && <MenuContainer menus={[menu]} />}
      </div>
    </>
  );
};

export default ViewMenu;
