import { Button } from "@/components/ui/button";
import Link from "next/link";
import arrowRightBlackPic from "@/assets/common/arrow_right_black.svg";
import shareIconPic from "@/assets/common/share_icon.svg";
import Image from "../../../node_modules/next/image.d";
import GraphChart from "@/components/pages/GraphChart";

export default async function Page({
  searchParams,
}: {
  searchParams: { highlight_id: string };
}) {
  return (
    <main className="flex w-full max-w-screen-sm flex-1 flex-col content-between px-4 pb-4 pt-8">
      <div className="text-5xl font-medium text-white">Exquisite Story</div>
      <GraphChart
        className="my-4 grow"
        highlightId={searchParams.highlight_id}
      />
      <Button asChild>
        <Link href="/chapters">
          {searchParams.highlight_id ? (
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
      {searchParams.highlight_id ? (
        <Button asChild className="mb-24 mt-4">
          <Link href="/chapters">
            Learn About Story Protocol{" "}
            <Image className="ml-2.5" src={shareIconPic} alt={"Blank Icon"} />
          </Link>
        </Button>
      ) : (
        <></>
      )}
    </main>
  );
}
