"use client";

import Image from "next/image";
import footerLogoPic from "@/assets/common/foot_logo.svg";
import { usePathname } from "next/navigation";

export default function FooterLogo() {
  const pathname = usePathname();
  const toStoryprotocol = () => {
    window.location.href = "https://www.storyprotocol.xyz";
  };
  return (
    <>
      {pathname === "/tv" ? (
        <></>
      ) : (
        <div className={"py-4"} onClick={toStoryprotocol}>
          <Image className={"mx-auto"} src={footerLogoPic} alt={"logo"} />
        </div>
      )}
    </>
  );
}
