import { init } from "echarts";
import { ImageResponse } from "next/og";
import { queryChaptersAfterID } from "@/app/api/chapters/relationship/server";
import { generateChartData, generateChartOption } from "@/lib/chartUtils";
import { NextRequest } from "next/server";
import { createCanvas, registerFont } from "canvas";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      highlight_id: string;
    };
  },
) {
  const { width, height } = { width: 1200, height: 630 };
  const highlightId = params.highlight_id;
  const response = await queryChaptersAfterID({
    from_chapter_id: 0,
    limit: 1000,
  });

  /**
   * There are two ways to generate Echarts images on the server-side.
   *
   * By default, Echarts generates images in SVG format. However, when
   * converting SVG to PNG using ImageResponse, the text inside the SVG is not
   * supported. This results in the "You" tag not being displayed correctly.
   *
   * Another option is to use canvas to render Echarts(What we used currently).
   * It works fine in local testing, but when deploying to Vercel, which is a
   * serverless hosting platform, there is an issue with fonts. Since the
   * serverless server does not include any font files, we need to manually
   * register the corresponding font files definitely.
   */
  const canvas = createCanvas(width, height);
  const file = path.resolve(
    process.cwd(),
    "src/assets/fonts/Roboto-Regular.ttf",
  );

  registerFont(file, {
    family: "Roboto",
  });
  const chart = init(canvas as unknown as HTMLElement);
  const chartData = generateChartData(response.chapters);
  const chartOptions = generateChartOption({
    chartData,
    highlightId,
    isTv: true,
  });
  chart.setOption(chartOptions);

  const dataURL = canvas.toDataURL("image/png");
  chart.dispose();

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "red",
          backgroundImage: "linear-gradient(168deg, #FF6E6E 0%, #9BABFF 100%)",
          height: "100%",
          width: "100%",
          display: "flex",
          fontSize: "24px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataURL} width={width} height={height} alt={""} />
      </div>
    ),
    {
      width: width,
      height: height,
    },
  );
}
