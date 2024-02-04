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
      className={cn("mt-4", cardStyle && " rounded-2xl bg-[#AA2627]/70 p-4")}
    >
      <div className={"flex items-center opacity-50"}>
        <Image src={hashIcon} alt={"wallet"} />
        <span className={"ml-1 text-xs"}>Oxf6Ccfb</span>
      </div>
      <div className={"flex items-center"}>
        <div className={"flex-1 text-xl"}>{chapter.content}</div>

        {showSiblingCount ? (
          <div className={"flex w-12 items-center"}>
            <Image src={branchIcon} alt={""} />
            {chapter.sibling_count}
          </div>
        ) : (
          <div className={"flex w-12 items-center"}>
            <Image src={arrowRight} alt={""} />
          </div>
        )}

        {/*<div className={"flex w-12 items-center"}>*/}
        {/*<Image src={branchIcon} alt={""} />*/}
        {/*  {chapter.sibling_count}*/}
        {/*</div>*/}
      </div>
      <div></div>
    </div>
  );
}
