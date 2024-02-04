export default async function Page({
  searchParams,
}: {
  searchParams: { highlight_id: string };
}) {
  return (
    <main> here is graph, will highlight {searchParams.highlight_id}</main>
  );
}
