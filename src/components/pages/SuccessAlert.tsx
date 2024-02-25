"use client";

import Image from "next/image";
import shareSuccessIconPic from "@/assets/chapter/shareSuccess_icon.svg";
import { useState, useEffect } from "react";

export default function SuccessAlert({
  title,
  msg,
  duration,
}: {
  title?: string;
  msg?: string;
  duration?: number;
}) {
  const [hide, setHide] = useState(true);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHide(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let timeTag: string | number | NodeJS.Timeout | undefined;
    if (duration) {
      timeTag = setTimeout(() => {
        setHide(true);
      }, duration + 1000);

      if (isHover) {
        clearTimeout(timeTag);
      }
    }
    return () => {
      if (timeTag) {
        clearTimeout(timeTag);
      }
    };
  }, [duration, isHover]);

  return (
    <div
      className={`shadow-[0px_2px_8px_0px_rgba(0, 0, 0, 0.10)] flex rounded-2xl bg-[#C9FFDB] transition-all ${!msg || hide ? "h-0 pb-0 pl-0 pr-0 pt-0 opacity-0" : " opacity-1 h-auto pb-6 pl-6 pr-4 pt-6"}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
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
