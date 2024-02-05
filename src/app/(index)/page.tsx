"use client";

import Link from "next/link";
import Image from "next/image";
import arrowRightBlackIcon from "@/assets/common/arrow_right_black.svg";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-[calc(100vh-33px)] flex-col justify-center gap-3 p-6 text-white">
      <h1 className="text-3xl font-bold">Exquisite Story</h1>
      <p>A collective storytelling journey.</p>
      <p>
        With Exquisite Story, you continue the story and shape how the story is
        told paragraph by paragraph.
      </p>
      <p>
        Once you tell your story, you can mint a commemorative Story Protocol
        NFT.
      </p>

      <div className="mt-4 flex gap-4">
        <Button className={"w-1/2"}>
          <Link href="/graph">View IP Graph</Link>
        </Button>
        <Button className={"w-1/2"} asChild>
          <Link href="/chapters">
            <span>Continue</span>
            <Image src={arrowRightBlackIcon} alt={"back"} className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
