"use client";

import { useEffect, useState } from "react";
import { Categories, Flavors, Menus, Variants } from "@prisma/client";
import Navbar from "./navbar";
import BreadcrumbBanner from "../breadcrumb-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MenuContainer from "../menu-container";
import { Badge } from "@/components/ui/badge";
import { getAllMenus } from "@/actions/menu";
import { getAllCategories } from "@/actions/category";

export interface MenusWithFeatures extends Menus {
  category: Categories;
  variants: Variants[];
  flavors: Flavors[];
}

const MenuPage = () => {
  const [menus, setMenus] = useState<MenusWithFeatures[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDate, setSelectedDate] = useState(
    "Date added: Newest to Oldest"
  );
  const [filteredMenus, setFilteredMenus] = useState<MenusWithFeatures[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await getAllMenus();
        setMenus(response);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };
    fetchMenus();
  }, []);

  // Update filteredMenus whenever menus change
  useEffect(() => {
    setFilteredMenus(menus);
  }, [menus]);

  // Effect to filter menus when the filters change
  useEffect(() => {
    let filtered = [...menus];

    // Filter by category (show all if "All Categories" is selected)
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (menu) => menu.category.name === selectedCategory
      );
    }

    // Sort by date added
    if (selectedDate === "Date added: Newest to Oldest") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (selectedDate === "Date added: Oldest to Newest") {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    setFilteredMenus(filtered); // Update filtered menus
  }, [selectedCategory, selectedDate, menus]); // Add dependencies

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <BreadcrumbBanner image="feature3.jpg" title="Menu" />
      <div className="md:px-40 px-10 py-10">
        <div className="flex md:flex-row flex-col items-center mb-10 justify-between">
          <div className="flex items-center gap-3">
            <p className="w-80 md:block hidden font-semibold text-lg">Filter By:</p>

            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={selectedCategory || "Categories"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>{" "}
                {/* Add All Categories */}
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder={selectedDate} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Date added: Newest to Oldest">
                  Date added: Newest to Oldest
                </SelectItem>
                <SelectItem value="Date added: Oldest to Newest">
                  Date added: Oldest to Newest
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge className="md:block hidden">{filteredMenus.length} products</Badge>
        </div>
        <MenuContainer menus={filteredMenus} />
      </div>
    </div>
  );
};

export default MenuPage;
