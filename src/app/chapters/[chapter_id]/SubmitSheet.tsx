import SubmitMethodChoose from "@/app/chapters/[chapter_id]/SubmitMethodChoose";
import { useEffect, useState } from "react";
import EnterWalletAddress from "@/app/chapters/[chapter_id]/EnterWalletAddress";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import FooterLogo from "@/components/pages/FooterLogo";
import { CreateChapterRequest } from "@/interface/createChapterRequest";
import { CreateChapterResponse } from "@/interface/createChapterResponse";
import Spinner from "@/components/pages/Spinner";

export default function SubmitSheet({
  open,
  onOpenChange,
  chapterId,
  content,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapterId: string;
  content: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowWallet(false);
    }
  }, [open]);

  const submitNewChapter = async (
    parentId: string,
    content: string,
    walletAddress?: string,
  ) => {
    const requestBody: CreateChapterRequest = {
      story_id: Number(chapterId),
      is_anonymous: !walletAddress,
      parent_id: Number(parentId),
      wallet_address: walletAddress || undefined,
      content: content,
    };
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/chapters`, {
        method: "POST",
        body: JSON.stringify(requestBody),
      });
      const result: CreateChapterResponse = await response.json();
      setIsSubmitting(false);

      if (response.ok) {
        router.push(`/graph?highlight_id=${result.id}`);
      } else {
        console.error("Failed to create chapter", result);
      }
    } catch (e) {
      console.error("Failed to create chapter", e);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={"bottom"} className={"h-full p-0"}>
        <div className={"flex h-full flex-col bg-linear px-4 pt-8"}>
          <div className={"text-5xl font-medium"}>Exquisite Story</div>

          <div className={"fixed bottom-0 left-1/2 -translate-x-1/2"}></div>

          {isSubmitting && <Spinner />}

          {showWallet ? (
            <EnterWalletAddress
              onSubmit={async (walletAddress) => {
                await submitNewChapter(chapterId, content, walletAddress);
              }}
            />
          ) : (
            <SubmitMethodChoose
              isSubmitting={isSubmitting}
              toWallet={() => {
                setShowWallet(true);
              }}
              toAnonymously={async () => {
                await submitNewChapter(chapterId, content);
              }}
            />
          )}
          <FooterLogo />
        </div>
      </SheetContent>
    </Sheet>
  );
}
