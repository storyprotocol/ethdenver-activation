import Link from "next/link";
import Image from "next/image";
import arrowRightBlackIcon from "@/assets/common/arrow_right_black.svg";
import { Button } from "@/components/ui/button";
import ClearGraphPage from "@/components/pages/ClearGraphPage";

export default function Page() {
  return (
    <main
      className={
        "flex w-full max-w-screen-sm flex-1 flex-col justify-center p-4"
      }
    >
      <div>
        <h1 className="text-5xl font-medium">Onchain Chronicles</h1>
        <div className={"mt-4 text-xl"}>
          A collective storytelling journey.
          <br />
          <br />
          With Onchain Chronicles, you continue the story and shape how the
          story is told paragraph by paragraph.
          <br />
          <br />
          Once you tell your story, you can mint a commemorative Story Protocol
          NFT.
        </div>

        <div className="mt-4 flex gap-4 py-4">
          <Button className={"w-1/2 shadow-2xl"}>
            <Link href={`/graph?timestamp=${new Date().getTime()}`}>
              View IP Graph
            </Link>
          </Button>
          <Button className={"w-1/2 shadow-2xl"} asChild>
            <Link href="/chapters">
              <span>Continue</span>
              <Image src={arrowRightBlackIcon} alt={"back"} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
      <ClearGraphPage />
    </main>
  );
}
