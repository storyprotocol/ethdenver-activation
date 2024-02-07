import { Button } from "@/components/ui/button";
import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import arrowRightBlack from "@/assets/common/arrow_right_black.svg";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function NewChapterTextarea({
  isLoading,
  onSubmit,
  maxLength = 280,
}: {
  isLoading: boolean;
  onSubmit: (context: string) => void;
  maxLength?: number;
}) {
  const [newContent, setNewContent] = useState("");

  if (isLoading) {
    return null;
  }

  const length = newContent.length;
  const isOverLimit = length > maxLength;

  return (
    <>
      <div className={"my-4 text-base text-white/50"}>
        continue the story...
      </div>

      <div className={"group relative"}>
        <TextareaAutosize
          className={cn(
            "block w-full rounded-md p-4 pb-12 pt-6 text-xl text-primary-foreground",
            "placeholder:text-primary-foreground/30 focus-visible:outline-none",
            "min-h-0 transition-all focus:min-h-40 group-hover:min-h-40",
          )}
          placeholder={"ie. And may the odds be ever in your favor."}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <div className={"absolute bottom-0 right-0 flex items-center"}>
          {maxLength && (
            <span
              className={cn(
                "text-xl",
                isOverLimit ? "text-destructive" : "text-primary-foreground/50",
              )}
            >
              {length}/{maxLength}
            </span>
          )}
          <Button
            className={"select-none space-x-1"}
            onClick={() => onSubmit(newContent)}
            disabled={!length || isLoading || isOverLimit}
          >
            <span>Submit</span>
            <Image
              src={arrowRightBlack}
              className={"fill-black"}
              alt={"submit"}
            />
          </Button>
        </div>
      </div>
    </>
  );
}
