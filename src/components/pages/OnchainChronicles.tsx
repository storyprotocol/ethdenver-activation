import Link from "next/link";

export default function OnchainChronicles() {
  return (
    <div>
      <Link href="/" className="text-5xl ">
        Onchain Chronicles
      </Link>
      <div className="mt-2 text-xl">
        This graph represents all the stories written on Onchain Chronicles.
        Each set of connected nodes show contributions branching from an origin
        story. Each contribution is attributed to a wallet address thus showing
        attribution and provenance.
      </div>
    </div>
  );
}
