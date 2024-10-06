import Link from "next/link";
import React from "react";

const BreadcrumbBanner = ({
  title,
  image,
}: {
  title: string;
  image?: string;
}) => {
  return (
    <div
      className="flex relative items-center bg-cover bg-center md:py-0 py-20 md:px-40 px-10 md:h-[30vh]"
      style={{ backgroundImage: `url('/images/${image}')` }}
    >
      <div className="absolute inset-0 w-full h-full bg-black/80 backdrop-blur" />
      <div className="container mx-auto px-4 z-20">
        <div className="text-white text-2xl font-bold">{title} Page</div>
        <div className="text-white text-lg">
          <Link href="/" className="text-muted-foreground">
            Home
          </Link>{" "}
          / {title}
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbBanner;
