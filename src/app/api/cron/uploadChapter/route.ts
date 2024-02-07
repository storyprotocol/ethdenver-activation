export async function GET() {
  console.log("uploading chapters...");
  const result = await fetch(
    `${process.env.CRON_API_ENDPOINT || "http://localhost:3000"}/api/upload/chapter`,
  );
  const data = await result.json();
  console.log("chapters are uploaded.");
  return Response.json(data);
}
