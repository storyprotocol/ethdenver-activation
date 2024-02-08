"use client";

import Image from "next/image";
import { Chapter } from "@/interface/chapter";
import hashIcon from "@/assets/chapter/hash_icon.svg";
import branchIcon from "@/assets/chapter/branch_icon.svg";
import arrowRight from "@/assets/common/arrow_right.svg";
import { cn } from "@/lib/utils";

export default function ChapterItem({
  chapter,
  showSiblingCount,
  cardStyle,
}: {
  chapter: Chapter;
  showSiblingCount?: boolean;
  cardStyle?: boolean;
}) {
  return (
    <div
      className={cn(
        "mt-4",
        cardStyle && " rounded-2xl bg-[#AA2627]/70 p-6 pr-4 shadow-2xl",
      )}
    >
      <div className={"flex items-center opacity-50"}>
        <Image src={hashIcon} alt={"wallet"} />
        <span className={"ml-1 text-xs"}>
          {chapter.wallet_address?.slice(0, 6)}
        </span>
      </div>
      <div className={cn("flex items-center", cardStyle ? "mt-2.5" : "mt-1")}>
        <div className={"w-1 flex-1 break-words text-xl"}>
          {chapter.content}
        </div>

        {showSiblingCount ? (
          <div className={"ml-2 flex w-12 items-center font-medium"}>
            <Image src={branchIcon} alt={""} />
            {chapter.sibling_count}
          </div>
        ) : (
          <div className={"ml-2 flex w-6 items-center"}>
            <Image src={arrowRight} alt={""} />
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}
