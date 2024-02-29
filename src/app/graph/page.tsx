import GraphRender from "@/components/pages/GraphRender";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { highlight_id: string };
}) {
  const highlightId = searchParams?.highlight_id;
  const metadataBase = process.env.METADATA_BASE || "";
  return {
    metadataBase: metadataBase ? new URL(metadataBase) : null,
    openGraph: {
      images: `${metadataBase}/og1/graph/${highlightId || "default"}?timestamp=${new Date().getTime()}`,
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: { highlight_id: string };
}) {
  const highlightId = searchParams?.highlight_id;

  return <GraphRender highlightId={highlightId} />;
}
