/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Timeline } from "@/components/aceternity/timeline";
import { MenuCard } from "./menu-card";
import { getFeaturedMenus } from "@/actions/menu";
import { formatPrice } from "@/lib/utils";

// Define the MenuSection component
const MenuSection = () => {
  const [groupedMenus, setGroupedMenus] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  // Fetch menus data using useEffect
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menus = await getFeaturedMenus(); // Fetch data from server action
        setGroupedMenus(menus); // Set the grouped menus into state
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchMenus(); // Call the function
  }, []);

  // Show loading state if data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Map through the grouped data to generate the timeline content
  const data = Object.keys(groupedMenus).map((category) => ({
    title: category, // Use the category as the title
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {groupedMenus[category].map((menu) => (
          <MenuCard
            key={menu.id}
            id={menu.id}
            imageUrl={menu.image} // Assuming 'image' refers to the image URL
            title={menu.name}
            description={menu.description}
            price={
              formatPrice(menu.variants[0]?.price.toFixed(2)) ||
              formatPrice(0.0)
            } // Convert price to a string
          />
        ))}
      </div>
    ),
  }));

  return (
    <div className="w-full font-sans md:px-10">
      <Timeline data={data} />
    </div>
  );
};

export default MenuSection;
