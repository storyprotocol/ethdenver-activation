export default async function Page({
  params,
}: {
  params: { storyId: string };
}) {
  return <main> here is graph {params.storyId}</main>;
}
