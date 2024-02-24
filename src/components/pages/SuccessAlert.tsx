"use client";

import Image from "next/image";
import shareSuccessIconPic from "@/assets/chapter/shareSuccess_icon.svg";
import { useState } from "react";

export default function SuccessAlert({
  title,
  msg,
  duration,
}: {
  title?: string;
  msg?: string;
  duration?: number;
}) {
  const [hide, setHide] = useState(false);

  if (duration) {
    setTimeout(() => {
      setHide(true);
    }, duration);
  }

  if (!msg || hide) {
    return null;
  }

  return (
    <div
      className={
        "shadow-[0px_2px_8px_0px_rgba(0, 0, 0, 0.10)]	flex rounded-2xl bg-[#C9FFDB] pb-6 pl-6 pr-4 pt-6"
      }
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
  );
}
