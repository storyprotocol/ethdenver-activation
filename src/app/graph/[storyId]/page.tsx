export default async function Page({
  params,
}: {
  params: { storyId: string };
}) {
  return <main> graph {params.storyId}</main>;
}
