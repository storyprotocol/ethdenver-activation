import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      Here is the landing page
      <div>
        <Button asChild>
          <Link href="/chapters">To stories</Link>
        </Button>
      </div>
      <div>
        <Button asChild>
          <Link href="/graph">To Graph</Link>
        </Button>
      </div>
    </div>
  );
}
