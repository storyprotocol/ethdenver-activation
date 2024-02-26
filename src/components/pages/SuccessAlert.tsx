"use client";

import Image from "next/image";
import shareSuccessIconPic from "@/assets/chapter/shareSuccess_icon.svg";
import { useState } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { AnimatePresence, motion } from "framer-motion";

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
                <div className="flex content-center	justify-center">
                  <Image
                    className="ml-2.5"
                    src={shareSuccessIconPic}
                    alt={"Success Icon"}
                  />
                </div>
              </div>
            </motion.li>
          </ToastPrimitive.Root>
        ))}
      </AnimatePresence>
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
}
