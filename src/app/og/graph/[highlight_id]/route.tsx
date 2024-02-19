import { init } from "echarts";
import { ImageResponse } from "next/og";
import { queryChaptersAfterID } from "@/app/api/chapters/relationship/server";
import { generateChartData, generateChartOption } from "@/lib/chartUtils";
import { NextRequest } from "next/server";

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
  const highlightId = params.highlight_id;
  const response = await queryChaptersAfterID({
    from_chapter_id: 0,
    limit: 1000,
  });

  // In SSR mode the first container parameter is not required
  const chart = init(null, null, {
    renderer: "svg", // must use SVG rendering mode
    ssr: true, // enable SSR
    width: 1200, // need to specify height and width
    height: 630,
  });

  const chartData = generateChartData(response.chapters);
  const chartOptions = generateChartOption({
    chartData,
    highlightId,
  });
  chart.setOption(chartOptions);
  const svgStr = chart.renderToSVGString();
  chart.dispose();

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "white",
          backgroundImage: "linear-gradient(168deg, #FF6E6E 0%, #9BABFF 100%)",
          height: "100%",
          width: "100%",
          display: "flex",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`}
          alt={""}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
