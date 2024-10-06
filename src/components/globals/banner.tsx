
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Banner = ({ title, image }: { title: string; image: string }) => {
  return (
    <div
      className="flex relative items-center bg-cover bg-center md:py-0 py-20 md:px-40 px-10 md:h-[30vh]"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 w-full h-full bg-black/80 backdrop-blur" />
      <div className="container mx-auto px-4 z-20">
        <p className="font-bold text-4xl mb-2">{title}</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/menu">Menus</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default Banner;
