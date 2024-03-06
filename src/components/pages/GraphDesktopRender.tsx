import GraphChart from "./GraphChart";
import OnchainChronicles from "./OnchainChronicles";
import ShareStory from "./ShareStory";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import arrowRightBlackPic from "@/assets/common/arrow_right_black.svg";
import shareIconPic from "@/assets/common/share_icon.svg";
import footerLogoPic from "@/assets/common/foot_logo.svg";
import { envConfig } from "@/lib/envConfig";

interface GraphDesktopRenderProps {
  highlightId?: string;
}

export default function GraphDesktopRender(props: GraphDesktopRenderProps) {
  const { highlightId } = props;
  const toStoryprotocol = () => {
    window.open("https://www.storyprotocol.xyz", "_blank");
  };
  return (
    <main className="flex w-full flex-1 content-between pb-4">
      <div className="flex grow flex-col pl-4	pt-8">
        <div className="text-5xl font-medium text-white">
          <OnchainChronicles />
        </div>
        <GraphChart
          className={"grow pl-12"}
          highlightId={highlightId}
          disablePolling={Boolean(highlightId)}
        />
      </div>
      <div className="flex w-full min-w-[480px] max-w-screen-sm flex-1 flex-col pr-16	pt-56">
        <ShareStory />
        <Button asChild className="shadow-2xl">
          <Link href="/chapters">
            {highlightId ? (
              <>Continue Another Story</>
            ) : (
              <>
                Continue a Story{" "}
                <Image
                  className="ml-2.5"
                  src={arrowRightBlackPic}
                  alt={"Button Icon"}
                />
              </>
            )}
          </Link>
        </Button>
        <Button asChild className="mb-4 mt-4">
          <a
            className="flex"
            target="_blank"
            href={envConfig.LEARN_STORY_PROTOCOL_LINK || ""}
          >
            Learn About Story Protocol{" "}
            <Image className="ml-2.5" src={shareIconPic} alt={"Blank Icon"} />
          </a>
        </Button>
        <div className={"cursor-pointer"} onClick={toStoryprotocol}>
          <Image className={"mx-auto"} src={footerLogoPic} alt={"logo"} />
        </div>
      </div>
    </main>
  );
}
