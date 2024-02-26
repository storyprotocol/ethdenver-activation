"use client";

import * as Icons from "@radix-ui/react-icons";
import { useState } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function SuccessAlert({
  title,
  msg,
  duration,
}: {
  title?: string;
  msg?: string;
  duration?: number;
}) {
  const [toastList, setToastList] = useState(["success"]);
  const isMediumDevice = useMediaQuery("(min-width : 769px)");
  const isSmallDevice = useMediaQuery("(max-width : 768px)");

  return (
    <ToastPrimitive.Provider>
      <AnimatePresence>
        {toastList.map((item) => (
          <ToastPrimitive.Root
            duration={duration}
            onOpenChange={(open) => {
              if (!open) setToastList([]);
            }}
            asChild
            forceMount
            key={item}
          >
            <motion.li
              initial={{
                y: -100,
                scale: 0.6,
                opacity: 0,
              }}
              animate={{
                y: 0,
                scale: 1,
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
                transition: { duration: 0.15 },
              }}
              layout
            >
              <div
                className={`shadow-[0px_2px_8px_0px_rgba(0, 0, 0, 0.10)] flex rounded-2xl bg-[#C9FFDB] pb-6 pl-6 pr-4 pt-6`}
              >
                <div className="mr-2 grow text-base leading-normal text-[#282828]">
                  <div>{title}</div>
                  <div>{msg}</div>
                </div>
                <ToastPrimitive.Close>
                  <div className="rounded-full border p-1">
                    <Icons.Cross2Icon className="shadow-[0px_0px_0px_2px_rgb(228, 226, 228)] h-4 w-4 text-[#282828]" />
                  </div>
                </ToastPrimitive.Close>
              </div>
            </motion.li>
          </ToastPrimitive.Root>
        ))}
      </AnimatePresence>
      <ToastPrimitive.Viewport
        className={`fixed w-[416px] max-w-screen-sm ${isMediumDevice ? "right-16 top-24" : ""} ${isSmallDevice ? "left-1/2 top-4	translate-x-[-50%]" : ""}`}
      />
    </ToastPrimitive.Provider>
  );
}
