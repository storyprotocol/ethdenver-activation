import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { storyId: string };
}) {
  return (
    <main>
      <div>content {params.storyId}</div>
      <Link href={"/stories"}>back</Link>
    </main>
  );
}
