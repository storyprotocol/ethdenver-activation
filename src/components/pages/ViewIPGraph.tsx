"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ViewIPGraph() {
  const router = useRouter();
  return (
    <Button
      className={"w-1/2 shadow-2xl"}
      onClick={() => {
        router.push(`/graph?timestamp=${new Date().getTime()}`);
      }}
    >
      View IP Graph
    </Button>
  );
}
