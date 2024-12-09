"use client";

import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/globals/admin-page/sidebar";
import {
  IconBrandTabler,
  IconBubbleTea,
  IconMessage,
  IconStack2,
  IconTicket,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const SidebarAdmin = ({
  imageUrl,
  name,
}: {
  imageUrl: string;
  name: string;
}) => {
  const [open, setOpen] = useState(false)

  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Menus",
      href: "/admin/menus",
      icon: (
        <IconBubbleTea className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: (
        <IconTruckDelivery className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Inventory",
      href: "/admin/inventory",
      icon: (
        <IconStack2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Messages",
      href: "/admin/messages",
      icon: (
        <IconMessage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Promos & Discounts",
      href: "/admin/promos-discounts",
      icon: (
        <IconTicket className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <SidebarLink
          link={{
            label: `${name}`,
            href: "#",
            icon: (
              <Image
                src={imageUrl}
                className="h-7 w-7 flex-shrink-0 rounded-full"
                width={50}
                height={50}
                alt="Avatar"
              />
            ),
          }}
        />
      </SidebarBody>
    </Sidebar>
  );
};

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src="/images/cflogo.png" alt="Logo" width={50} height={50} />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Coffee Prince
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src="/images/cflogo.png" alt="Logo" width={50} height={50} />
    </Link>
  );
};

export default SidebarAdmin;
