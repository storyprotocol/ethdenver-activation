"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import footerLogoPic from "@/assets/common/foot_logo.svg";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function FooterLogo() {
  const pathname = usePathname();
  const [isHighlight, setIsHighlight] = useState(false);
  const isMediumDevice = useMediaQuery("(min-width : 769px)");
  const toStoryprotocol = () => {
    window.open("https://www.storyprotocol.xyz", "_blank");
  };
  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    setIsHighlight(Boolean(params.get("highlight_id")));
  }, []);
  return (
    <>
      {pathname === "/tv" ||
      (pathname === "/graph" && isHighlight && isMediumDevice) ? (
        <></>
      ) : (
        <div className={"cursor-pointer py-4"} onClick={toStoryprotocol}>
          <Image className={"mx-auto"} src={footerLogoPic} alt={"logo"} />
        </div>
      )}
    </>
  );
}
