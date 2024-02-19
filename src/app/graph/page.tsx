import { Button } from "@/components/ui/button";
import Link from "next/link";
import arrowRightBlackPic from "@/assets/common/arrow_right_black.svg";
import shareIconPic from "@/assets/common/share_icon.svg";
import Image from "../../../node_modules/next/image.d";
import GraphChart from "@/components/pages/GraphChart";
import GraphChapters from "./GraphChapters";
import { envConfig } from "@/lib/envConfig";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { highlight_id: string };
}) {
  const highlightId = searchParams?.highlight_id;
  const metadataBase = process.env.METADATA_BASE || "";
  return {
    metadataBase: metadataBase ? new URL(metadataBase) : null,
    openGraph: {
      images: `${metadataBase}/og/graph/${highlightId || "default"}`,
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: { highlight_id: string };
}) {
  const highlightId = searchParams?.highlight_id;

  return (
    <main className="flex w-full max-w-screen-sm flex-1 flex-col content-between px-4 pb-4 pt-8">
      <div className="text-5xl font-medium text-white">Onchain Chronicles</div>
      <GraphChart
        className={`${highlightId ? "h-[90vw] max-h-[600px]" : "grow"}`}
        highlightId={highlightId}
      />
      <GraphChapters chapterId={highlightId} className="mb-4" />
      <Button asChild className="shadow-2xl">
        <Link href="/chapters">
          {highlightId ? (
            <>Continue Another Story</>
          ) : (
            <>
              Continue a Story{" "}
              <Image
                className="ml-2.5"
                src={arrowRightBlackPic}
                alt={"Button Icon"}
              />
            </>
          )}
        </Link>
      </Button>
      {highlightId ? (
        <Button asChild className="mb-12 mt-4">
          <a
            className="flex"
            target="_blank"
            href={envConfig.LEARN_STORY_PROTOCOL_LINK || ""}
          >
            Learn About Story Protocol{" "}
            <Image className="ml-2.5" src={shareIconPic} alt={"Blank Icon"} />
          </a>
        </Button>
      ) : (
        <></>
      )}
    </main>
  );
}
