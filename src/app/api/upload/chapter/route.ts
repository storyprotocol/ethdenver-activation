import { NextRequest } from "next/server";
import { uploadChapter, uploadRelationship } from "../service/upload";
import {
  queryUploadStatistics,
  updateUploadStatistics,
  UploadStatisticMO,
} from "../../model";

export const dynamic = "force-dynamic";

const uploadTotal = process.env.UPLOAD_TOTAL || "10";
const uploadInterval = process.env.UPLOAD_INTERVAL || "15";
const isOpen = process.env.IS_OPEN || "false";

export async function GET(request: NextRequest): Promise<Response> {
  if (isOpen === "false") {
    const response = {
      result: "reject",
      message: "Upload is not open",
    };
    return Response.json(response);
  }

  const now = Date.now();
  const uploadStatistics: UploadStatisticMO = await queryUploadStatistics();
  console.log(
    `Last upload time: ${uploadStatistics.lastUploadTime}, now: ${now}`,
  );

  if (
    now - uploadStatistics.lastUploadTime <
    1000 * 60 * parseInt(uploadInterval)
  ) {
    const response = {
      result: "reject",
      message: "Upload too frequently",
    };
    return Response.json(response);
  }

  const total = parseInt(uploadTotal);
  const chapterResult = await uploadChapter(total);
  const relationshipResult = await uploadRelationship(
    total,
    "PREVIOUS_CHAPTER",
  );
  const response = {
    result: "success",
    message: `Upload result: ${chapterResult} chapters, ${relationshipResult} relationships`,
  };
  await updateUploadStatistics({
    id: uploadStatistics.id,
    lastUploadTime: now,
    storyUploaded: uploadStatistics.storyUploaded,
    chapterUploaded: uploadStatistics.chapterUploaded + chapterResult,
    relationshipUploaded:
      uploadStatistics.relationshipUploaded + relationshipResult,
  });
  return Response.json(response);
}
