"use client";

import { ImagesSlider } from "@/components/aceternity/images-slider";
import { FeaturesSection } from "@/components/globals/landing-page/features";
import Footer from "@/components/globals/landing-page/footer";
import MenuSection from "@/components/globals/landing-page/menus";
import Navbar from "@/components/globals/landing-page/navbar";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import SparklesText from "@/components/magicui/sparkles-text";
import { useClerk, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const images = ["/images/bg1.jpg", "/images/bg2.jpg", "/images/bg3.jpg"];

export default function Home() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Redirect to sign-in if no user is logged in
    if (!user) {
      router.push("/");
      return;
    }

    // Check if user is an admin
    const isAdmin =
      user?.emailAddresses[0]?.emailAddress === "coffeeprinceadmin@gmail.com";

    if (isAdmin) {
      signOut({ redirectUrl: "/" });
    } else {
      setIsAuthorized(true);
    }
  }, [user, router, signOut]);

  // Render nothing while checking authorization status
  if (!isAuthorized) {
    return null;
  }
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <ImagesSlider className="h-screen" images={images}>
        <motion.div
          initial={{
            opacity: 0,
            y: -80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="z-50 px-10 flex flex-col justify-center items-center"
        >
          <SparklesText className="text-white" text="EXPRESSO YOURSELF" />
          <GradualSpacing
            className="font-display text-center text-sm font-bold tracking-[-0.1em] leading-0 text-white md:text-2xl md:leading-[5rem]"
            text="Pure coffee, pure community, pure experience, because you can never
            have too much coffee in your life."
          />
          <button
            onClick={() => router.push("/menu")}
            className="px-10 py-2 backdrop-blur-sm border bg-orange-300/50 border-orange-500/20 text-white mx-auto text-center rounded-full relative mt-4"
          >
            <span className="text-lg">Buy Now &rarr;</span>
            <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-orange-500 to-transparent" />
          </button>
        </motion.div>
      </ImagesSlider>
      <section id="about">
        <FeaturesSection />
      </section>
      <MenuSection />
      <Footer />
    </div>
  );
}
