import Image from "next/image";
import footerLogoPic from "@/assets/common/foot_logo.svg";

export default function FooterLogo() {
  return (
    <div className={"py-2"}>
      <Image className={"mx-auto"} src={footerLogoPic} alt={"Footer Logo"} />
    </div>
  );
}
