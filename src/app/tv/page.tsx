import GraphChart from "@/components/pages/GraphChart";
import QRCode from "react-qr-code";
import { envConfig } from "@/lib/envConfig";

export default async function Page() {
  return (
    <main className="flex w-full flex-1 grow items-stretch justify-between">
      <div className="relative flex w-[430px] flex-col pl-9 pt-9">
        <div className="absolute z-40">
          <div className="drop-shadow-[0_0_32px_rgba(0, 0,	0, 0.25)] whitespace-nowrap text-[56px] font-medium">
            Continue the story at
          </div>
          <div className="drop-shadow-[0_0_32px_rgba(0, 0,	0, 0.25)] mb-10 whitespace-nowrap text-[56px] font-medium">
            exquisitestory.xyz
          </div>
          {envConfig.QR_CODE_TV ? (
            <QRCode
              size={200}
              value={envConfig.QR_CODE_TV || ""}
              fgColor="#FFFFFF"
              bgColor="transparent"
            />
          ) : (
            <>
              Please set the QR code address environment variable:
              NEXT_PUBLIC_QR_CODE_TV
            </>
          )}
        </div>
      </div>
      <GraphChart className="w-6/12 min-w-px grow" isTv />
    </main>
  );
}
