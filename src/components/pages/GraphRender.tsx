"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import GraphDesktopRender from "./GraphDesktopRender";
import GraphMobileRender from "./GraphMobileRender";
import Spinner from "@/components/pages/Spinner";

interface GraphRenderProps {
  highlightId?: string;
}

export default function GraphRender(props: GraphRenderProps) {
  const { highlightId } = props;
  const isMediumDevice = useMediaQuery("(min-width : 769px)");
  const isSmallDevice = useMediaQuery("(max-width : 768px)");
  if (!isMediumDevice && !isSmallDevice) {
    return (
      <main className="flex w-full max-w-screen-sm flex-1 flex-col content-between px-4 pb-4 pt-8">
        <Spinner />
      </main>
    );
  }
  return (
    <>
      {highlightId && isMediumDevice ? (
        <GraphDesktopRender highlightId={highlightId} />
      ) : (
        <GraphMobileRender highlightId={highlightId} />
      )}
    </>
  );
}
