import Image from "next/image";
import arrowRightBlackIcon from "@/assets/common/arrow_right_black.svg";
import { Button } from "@/components/ui/button";
import ClearGraphPage from "@/components/pages/ClearGraphPage";
import ViewIPGraph from "@/components/pages/ViewIPGraph";

export default function Page() {
  return (
    <main
      className={
        "flex w-full max-w-screen-sm flex-1 flex-col justify-center p-4"
      }
    >
      <h1 className="mb-4 text-5xl font-medium">Onchain Chronicles</h1>
      <p className="mb-4 text-xl">A collective storytelling journey.</p>
      <p className="mb-4 text-xl">
        Thank you for everyone who participated and contributed to Onchain
        Chronicles during ETH Denver 2024. We would be airdropping a
        commemorative NFT to all participants. Stay tuned to our socials for
        more information.
      </p>
      <p className="mb-4 text-xl">
        With Onchain Chronicles, you continue the story and shape how the story
        is told paragraph by paragraph.
      </p>
      <p className="text-xl">
        Once you tell your story, you can mint a commemorative Story Protocol
        NFT.
      </p>
      <div className="mt-4 flex gap-4 py-4">
        <ViewIPGraph />
        <Button className={"w-1/2 shadow-2xl"} asChild>
          <a href="https://twitter.com/StoryProtocol" target="blank">
            <span>Continue</span>
            <Image src={arrowRightBlackIcon} alt={"back"} className="ml-2" />
          </a>
        </Button>
      </div>
      <ClearGraphPage />
    </main>
  );
}
