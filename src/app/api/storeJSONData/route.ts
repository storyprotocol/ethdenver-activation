import * as fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/public/data.json");

export async function GET(): Promise<Response> {
  let mockResponse: unknown;
  try {
    mockResponse = await fs.readFileSync(dataFilePath);
  } catch (err) {
    return Response.json(err);
  }
  return Response.json({
    chapters: JSON.parse(mockResponse as string),
  });
}
