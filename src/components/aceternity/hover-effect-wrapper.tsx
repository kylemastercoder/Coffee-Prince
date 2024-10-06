/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { useState } from "react";

interface HoverEffectWrapperProps {
  children: React.ReactNode;
  disabled?: boolean;
}

const HoverEffectWrapper = ({
  children,
  disabled,
}: HoverEffectWrapperProps) => {
  const radius = 100;

  // Ensure these hooks are always called, regardless of the `visible` state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apply useMotionTemplate unconditionally but update only when visible
  const dynamicBackgroundStyle = useMotionTemplate`
    radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px,
    hsl(var(--${disabled ? "secondary" : "ring"})),
    transparent 80%)
  `;

  // `visible` controls whether the dynamic background is applied
  const [visible, setVisible] = useState(false);

  // Handle mouse movement to update position values
  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Conditional className or background application
  const backgroundStyle = visible ? dynamicBackgroundStyle : "transparent";

  return (
    <motion.div
      style={{ background: backgroundStyle }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="p-[2px] rounded-lg transition duration-300 group/input w-full"
    >
      <section className="shad-input-icon">{children}</section>
    </motion.div>
  );
};

export default HoverEffectWrapper;
