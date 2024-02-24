import SubmitMethodChoose from "@/app/chapters/[chapter_id]/SubmitMethodChoose";
import { useEffect, useState } from "react";
import EnterWalletAddress from "@/app/chapters/[chapter_id]/EnterWalletAddress";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import FooterLogo from "@/components/pages/FooterLogo";
import { CreateChapterRequest } from "@/interface/createChapterRequest";
import { CreateChapterResponse } from "@/interface/createChapterResponse";
import Spinner from "@/components/pages/Spinner";
import { X } from "lucide-react";
import NetworkErrorAlert from "@/components/pages/NetworkErrorAlert";
import axios from "axios";
import { ErrorResponse } from "@/interface/errorResponse";
import { formatError } from "@/lib/fetcher";
import OnchainChronicles from "@/components/pages/OnchainChronicles";

export default function SubmitSheet({
  open,
  onOpenChange,
  chapterId,
  storyId,
  content,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapterId: string;
  storyId: string;
  content: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [walletOrEnsAddress, setWalletOrEnsAddress] = useState("");
  const [realWalletAddress, setRealWalletAddress] = useState("");

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
      story_id: Number(storyId),
      is_anonymous: !walletAddress,
      parent_id: Number(parentId),
      wallet_address: walletAddress || undefined,
      content: content,
    };
    setIsSubmitting(true);
    try {
      const response = await axios.post<CreateChapterResponse>(
        `/api/chapters`,
        requestBody,
      );
      sessionStorage.setItem("isSubmit", "true");
      /**
       * Redirect to the graph page need times when the network is slow
       * So we didn't setIsSubmitting(false) to keep the loading spinner
       */
      router.push(
        `/graph?highlight_id=${response.data.id}&timestamp=${new Date().getTime()}`,
      );
    } catch (e) {
      console.error("Failed to create chapter", e);
      setIsSubmitting(false);
      setError(formatError(e));
    }
  };

  const closeSheet = () => {
    if (showWallet) {
      setShowWallet(false);
      return;
    }

    onOpenChange(false);
  };

  if (open && !storyId) {
    return <Spinner />;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={"bottom"}
        className={"flex h-full w-full justify-center bg-linear p-0"}
      >
        <div className={"flex h-full w-full flex-col px-4 pt-8"}>
          <div className={"text-5xl font-medium"}>
            <OnchainChronicles />
          </div>

          <div className="flex max-w-screen-sm grow flex-col self-center">
            {isSubmitting && <Spinner />}

            {showWallet ? (
              <EnterWalletAddress
                walletOrEns={walletOrEnsAddress}
                setWalletAddress={setWalletOrEnsAddress}
                setRealWalletAddress={setRealWalletAddress}
                onSubmit={async () => {
                  await submitNewChapter(chapterId, content, realWalletAddress);
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
        </div>

        {error && (
          <div className={"fixed top-40 w-full"}>
            <NetworkErrorAlert
              error={error}
              onRetry={async () => {
                await submitNewChapter(chapterId, content, realWalletAddress);
              }}
              isValidating={isSubmitting}
            />
          </div>
        )}

        <div
          onClick={closeSheet}
          className="absolute right-0 top-0 cursor-pointer rounded-xl bg-white/0 p-4"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
