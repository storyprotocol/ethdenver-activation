"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "../../../node_modules/next/image.d";
import shareSuccessIconPic from "@/assets/chapter/shareSuccess_icon.svg";

export default function ShareStory() {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  return (
    <>
      <Button
        className={`mb-4 shadow-2xl ${copySuccess ? "bg-[#C9FFDB] hover:bg-[#C9FFDB]" : ""}`}
        onClick={() => handleCopy()}
      >
        {copySuccess ? (
          <>
            Link Copied!
            <Image
              className="ml-2.5"
              src={shareSuccessIconPic}
              alt={"Blank Icon"}
            />
          </>
        ) : (
          <>Share Your Story</>
        )}
      </Button>
    </>
  );
}
