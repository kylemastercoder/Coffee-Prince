"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useAuth, UserButton } from "@clerk/nextjs";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { getAllMenus } from "@/actions/menu";
import { Menus } from "@prisma/client";

const Navbar = () => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const cart = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMenus, setFilteredMenus] = useState<Menus[]>([]);
  const [allMenus, setAllMenus] = useState<Menus[]>([]);

  useEffect(() => {
    // Fetch all menus on load
    const fetchMenus = async () => {
      try {
        const menus = await getAllMenus();
        setAllMenus(menus);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    // Filter the menus based on the search term
    if (searchTerm) {
      const filtered = allMenus.filter((menu) =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenus(filtered);
    } else {
      setFilteredMenus([]);
    }
  }, [searchTerm, allMenus]);

  return (
    <header className="sticky backdrop-blur z-50 top-0 flex h-24 shadow-xl items-center gap-20 px-4 md:px-60">
      <nav className="hidden md:flex md:items-center gap-6 text-md font-medium md:gap-10">
        <Link href="/" className="flex items-center">
          <Image src="/images/cflogo.png" width={300} height={300} alt="Logo" />
        </Link>
        <Link
          href="/"
          className="text-white transition-colors hover:text-orange-600"
        >
          Home
        </Link>
        <Link
          href="/menu"
          className="text-white transition-colors hover:text-orange-600"
        >
          Menu
        </Link>
        <Link
          href="/#about"
          className="text-white transition-colors hover:text-orange-600"
        >
          About
        </Link>
        <Link
          href="/contact-us"
          className="text-white transition-colors hover:text-orange-600"
        >
          Contact
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="flex items-center">
              <Image
                src="/images/cflogo.png"
                width={300}
                height={300}
                alt="Logo"
              />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Menu
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQs
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="flex-1 md:ml-auto sm:flex-initial">
          <div className="relative bg-white rounded-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search menus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-black sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
            {searchTerm && (
              <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {filteredMenus.length > 0 ? (
                  filteredMenus.map((menu) => (
                    <div
                      key={menu.id}
                      className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        router.push(`/menu/${menu.id}`);
                        setSearchTerm("");
                      }}
                    >
                      {menu.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-black">No results found</div>
                )}
              </div>
            )}
          </div>
        </form>
        <Button
          onClick={() => router.push("/cart")}
          className="flex items-center rounded-full bg-black px-4 py-2"
        >
          <ShoppingBag size={20} color="white" />
          <span className="ml-2 text-sm font-medium text-white">
            {cart.items.length}
          </span>
        </Button>
        {/* user button */}
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Button asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
