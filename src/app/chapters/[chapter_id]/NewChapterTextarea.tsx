import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import arrowRightBlack from "@/assets/common/arrow_right_black.svg";
import { useState } from "react";

export default function NewChapterTextarea({
  isLoading,
  onSubmit,
}: {
  isLoading: boolean;
  onSubmit: (context: string) => void;
}) {
  const [newContent, setNewContent] = useState("");

  if (isLoading) {
    return null;
  }

  return (
    <>
      <div className={"my-4 text-base text-white/50"}>
        continue the story...
      </div>

      <div>
        <Textarea
          className={
            "h-40 p-6 pt-8 text-xl text-primary-foreground transition-all placeholder:text-primary-foreground/30 focus:h-80"
          }
          placeholder={"ie. And may the odds be ever in your favor."}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          maxLength={280}
        />
        <div className={"relative -top-12 text-right"}>
          <Button
            className={"space-x-1"}
            onClick={() => onSubmit(newContent)}
            disabled={isLoading}
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
