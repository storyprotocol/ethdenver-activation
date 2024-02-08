"use client";

import Image from "next/image";
import footerLogoPic from "@/assets/common/foot_logo.svg";
import { usePathname } from "next/navigation";

export default function FooterLogo() {
  const pathname = usePathname();
  return (
    <>
      {pathname === "/tv" ? (
        <></>
      ) : (
        <div className={"py-4"}>
          <Image className={"mx-auto"} src={footerLogoPic} alt={"logo"} />
        </div>
      )}
    </>
  );
}
