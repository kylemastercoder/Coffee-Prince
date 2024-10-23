
import React from "react";
import { MenuCard } from "./landing-page/menu-card";
import { formatPrice } from "@/lib/utils";
import { MenusWithFeatures } from "./landing-page/menu-page";

const MenuContainer = ({ menus }: { menus: MenusWithFeatures[] }) => {
  return (
    <div className="grid md:grid-cols-4 grid-cols-1 mt-5 gap-5">
      {menus.map((menu) => (
        <MenuCard
          key={menu.id}
          id={menu.id}
          imageUrl={menu.image}
          title={menu.name}
          description={menu.description}
          price={formatPrice(menu.variants[0]?.price.toFixed(2)) || formatPrice(0.00)}
        />
      ))}
    </div>
  );
};

export default MenuContainer;
