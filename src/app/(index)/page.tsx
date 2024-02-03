import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      Here is the landing page
      <div>
        <Button asChild>
          <Link href="/stories">To stories</Link>
        </Button>
      </div>
    </div>
  );
}
