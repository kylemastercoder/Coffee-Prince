"use client";

import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";

interface AIButtonProps {
  label: string;
  onResult: (result: string | boolean | object) => void;
  disabled?: boolean;
}

// Change to async function
export function AIButton({ label, onResult, disabled }: AIButtonProps) {
  //change to async function and server client
  const handleAIRequest = (event: React.MouseEvent) => {
    event.preventDefault();
    onResult(true);
  };

  return (
    <button onClick={handleAIRequest} disabled={disabled}>
      <AnimatedGradientText className="md:h-12 h-10 text-xl px-5">
        ✨<hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />
        {"  "}
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#b2762c]/50 via-[#6d2cb2]/50 to-[#b2762c]/50 bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
          )}
        >
          {label}
        </span>
      </AnimatedGradientText>
    </button>
  );
}
