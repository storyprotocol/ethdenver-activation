import GraphChart from "@/components/pages/GraphChart";
import qrCodePic from "@/assets/tv/qr_code.svg";
import Image from "../../../node_modules/next/image.d";

export default async function Page() {
  return (
    <main className="flex w-full flex-1 grow items-stretch justify-between">
      <div className="flex flex-col pl-9 pt-9">
        <div className="drop-shadow-[0_0_32px_rgba(0, 0,	0, 0.25)] whitespace-nowrap text-[56px] font-medium">
          Continue the story at
        </div>
        <div className="drop-shadow-[0_0_32px_rgba(0, 0,	0, 0.25)] whitespace-nowrap text-[56px] font-medium">
          exquisitestory.xyz
        </div>
        <Image className="mt-10" src={qrCodePic} alt={"Blank Icon"} />
      </div>
      <GraphChart className="w-6/12 min-w-px grow" isTv />
    </main>
  );
}
