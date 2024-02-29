import GraphChapters from "@/app/graph/GraphChapters";
import GraphChart from "./GraphChart";
import OnchainChronicles from "./OnchainChronicles";
import ShareStory from "./ShareStory";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import arrowRightBlackPic from "@/assets/common/arrow_right_black.svg";
import shareIconPic from "@/assets/common/share_icon.svg";
import { envConfig } from "@/lib/envConfig";
import footerLogoPic from "@/assets/common/foot_logo.svg";

interface GraphMobileRenderProps {
  highlightId?: string;
}

export default function GraphMobileRender(props: GraphMobileRenderProps) {
  const { highlightId } = props;
  const toStoryprotocol = () => {
    window.open("https://www.storyprotocol.xyz", "_blank");
  };
  return (
    <>
      <main className="flex w-full flex-1 flex-col justify-center px-4 pb-4 pt-8">
        <div className="flex w-full max-w-screen-sm shrink font-medium text-white">
          <OnchainChronicles />
        </div>
        <GraphChart
          className={`${highlightId ? "h-[90vw] max-h-[600px]" : "grow"}`}
          highlightId={highlightId}
          disablePolling={Boolean(highlightId)}
        />
        <div className="flex w-full max-w-screen-sm shrink flex-col self-center">
          {highlightId ? (
            <GraphChapters chapterId={highlightId} className="mb-4" />
          ) : null}
          {highlightId ? <ShareStory /> : null}
          <Button asChild className="grow shadow-2xl">
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
          {highlightId ? (
            <Button asChild className="mb-12 mt-4 grow">
              <a
                className="flex"
                target="_blank"
                href={envConfig.LEARN_STORY_PROTOCOL_LINK || ""}
              >
                Learn About Story Protocol{" "}
                <Image
                  className="ml-2.5"
                  src={shareIconPic}
                  alt={"Blank Icon"}
                />
              </a>
            </Button>
          ) : (
            <></>
          )}
        </div>
      </main>
      <div className={"cursor-pointer py-4"} onClick={toStoryprotocol}>
        <Image className={"mx-auto"} src={footerLogoPic} alt={"logo"} />
      </div>
    </>
  );
}
