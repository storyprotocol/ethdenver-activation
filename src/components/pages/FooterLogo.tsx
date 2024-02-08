"use client";
import Image from "next/image";
import footerLogoPic from "@/assets/common/foot_logo.svg";

export default function FooterLogo() {
  const toStoryprotocol = () => {
    window.location.href = "https://www.storyprotocol.xyz";
  };

  return (
    <div className={"py-4"} onClick={toStoryprotocol}>
      <Image className={"mx-auto"} src={footerLogoPic} alt={"logo"} />
    </div>
  );
}
