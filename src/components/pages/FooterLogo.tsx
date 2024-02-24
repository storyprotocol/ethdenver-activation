"use client";

import Image from "next/image";
import footerLogoPic from "@/assets/common/foot_logo.svg";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function FooterLogo() {
  const pathname = usePathname();
  const toStoryprotocol = () => {
    window.open("https://www.storyprotocol.xyz", "_blank");
  };
  return (
    <>
      {pathname === "/tv" || pathname === "/graph" ? (
        <></>
      ) : (
        <div className={"cursor-pointer py-4"} onClick={toStoryprotocol}>
          <Image className={"mx-auto"} src={footerLogoPic} alt={"logo"} />
        </div>
      )}
    </>
  );
}
