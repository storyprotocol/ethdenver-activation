import { init } from "echarts";
import { ImageResponse } from "next/og";
import { queryChaptersAfterID } from "@/app/api/chapters/relationship/server";
import { generateChartData, generateChartOption } from "@/lib/chartUtils";
import { NextRequest } from "next/server";
import { createCanvas, registerFont } from "canvas";
import path from "path";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
    limit: 100000,
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
    isMediumDevice: true,
  });

  /**
   * Disable animation to avoid the "You" tag not being displayed correctly.
   */
  chartOptions.animation = false;
  chartOptions.series.forEach((item) => {
    item.animation = false;
    item.force.layoutAnimation = false;
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            width: "230px",
          }}
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjEwNyIgdmlld0JveD0iMCAwIDMyMCAxMDciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGgKICAgIGQ9Ik0xNjkuNzkgNDMuNzU3OEgxNzguNjA4VjI2LjEwNjFMMTkxLjg4IDIuMDEzODJIMTgxLjc0N0wxNjkuNzkgMjQuMzE3MVY0My43NTc4Wk0xNjIuMDQ4IDIwLjI5MTdIMTcxLjk0MkwxNjIuMDQ4IDIuMDEzODJIMTUyLjEyM0wxNjIuMDQ4IDIwLjI5MTdaTTE0Mi40OTggMTYuNDQ1M0MxNDIuNDk4IDIwLjczOSAxNDAuMTY2IDIyLjgyNjIgMTM1LjcxMiAyMi44MjYySDEyNy4xOTNWMTAuMjczMkgxMzUuNDEzQzEzOS44NjcgMTAuMjczMiAxNDIuNDk4IDEyLjE1MTcgMTQyLjQ5OCAxNi40NDUzWk0xMTguMDc2IDQzLjc1NzhIMTI3LjE5M1YzMS4wODU2SDEzNS43MTJDMTM2LjIyIDMxLjA4NTYgMTM2LjcyOSAzMS4wNTU3IDEzNy4yMzcgMzEuMDI1OUwxNDMuOTAzIDQzLjc1NzhIMTUzLjY0OEwxNDUuNDg3IDI4LjQzMThDMTQ5LjM3MyAyNS43NzgxIDE1MS4yNTYgMjEuMzk1IDE1MS4yNTYgMTYuNDQ1M0MxNTEuMjU2IDguMzY0ODcgMTQ2LjI2NCAyLjAxMzgyIDEzNS40MTMgMi4wMTM4MkgxMTguMDc2VjQzLjc1NzhaTTEwNS40OTEgMjIuODI2MkgxMDEuMzk2QzEwMS4zOTYgMjguMjIzMSA5Ny4zNjAxIDMyLjIxODYgOTIuMzA4MyAzMi4yMTg2VjM2LjMwMzZDODQuODk0OSAzNi4zMDM2IDc5LjUxNDIgMzAuMTkxIDc5LjUxNDIgMjIuODI2MkM3OS41MTQyIDE0Ljg2NSA4NC4yOTcxIDkuNTI3NzQgOTIuMzA4MyA5LjUyNzc0Qzk5LjcyMTYgOS41Mjc3NCAxMDUuNDkxIDE1LjE2MzIgMTA1LjQ5MSAyMi44MjYyWk05Mi4zMDgzIDQ0LjcxMlY0MC40MTgzQzEwMi4wMjMgNDAuNDE4MyAxMDkuMzE3IDMyLjg3NDYgMTA5LjMxNyAyMi44MjYySDExMy44MDFDMTEzLjgwMSAxMC45MjkxIDEwNC41MzQgMC45NzAyMTUgOTIuMzA4MyAwLjk3MDIxNUM3OS4xODU0IDAuOTcwMjE1IDcwLjcyNTggMTAuMDY0NSA3MC43MjU4IDIyLjgyNjJDNzAuNzI1OCAzNC43MjMzIDgwLjA4MjIgNDQuNzEyIDkyLjMwODMgNDQuNzEyWk00OC4zMzYzIDQzLjc1NzhINTcuNTQzMlYxMC4yNDM0SDcwLjc4NTZWMS45ODRIMzUuMTIzOFYxMC4yNDM0SDQ4LjMzNjNWNDMuNzU3OFpNMTYuNzA5OSA0NC43MTJDMjUuODU3MSA0NC43MTIgMzMuMjcwNCAzOS4yMjU2IDMzLjI3MDQgMzAuMDQyQzMzLjI3MDQgMjEuMzk1IDI2Ljc4MzcgMTUuMzcxOSAxNi42ODAxIDE1LjM3MTlWMjEuNzIzQzEyLjAxNjggMjEuNzIzIDguNjA5MDYgMTkuNjk1NCA4LjYwOTA2IDE1LjQ5MTJDOC42MDkwNiAxMS40NjU5IDExLjU2ODQgOC44MTIxMyAxNi45MTkyIDguODEyMTNDMjEuMzEzNCA4LjgxMjEzIDIzLjk3MzggMTAuNjMxIDI0LjYzMTUgMTMuMDE2M0gzMi43NjIzQzMyLjEzNDUgNi4zNjcxMiAyNS44NTcxIDAuOTcwMjE1IDE2LjczOTggMC45NzAyMTVDNy4xMTQ0MyAwLjk3MDIxNSAwLjI2OTAzMyA2Ljk2MzQ3IDAuMjY5MDMzIDE1LjcyOTdDMC4yNjkwMzMgMjQuNjQ1IDcuMzgzNDYgMjkuNzQzOCAxNi42ODAxIDI5Ljc0MzhWMjMuNjkwOUMyMS42MTIzIDIzLjY5MDkgMjQuOTkwMiAyNS44OTc0IDI0Ljk5MDIgMzAuMTkxQzI0Ljk5MDIgMzQuNTQ0MyAyMS41MjI3IDM2Ljg5OTkgMTYuNzA5OSAzNi44OTk5QzEyLjM3NTUgMzYuODk5OSA5LjM1NjM4IDM0Ljk5MTYgOC40Mjk3MSAzMi4zNjc3SDBDMS4xOTU3IDM5LjI4NTMgNy41NjI4MiA0NC43MTIgMTYuNzA5OSA0NC43MTJaTTI1Mi43MTIgODUuMTE0M0MyNTIuNzEyIDc3LjAwNCAyNTcuODIzIDcxLjY2NjcgMjY1LjU2NiA3MS42NjY3QzI3My4zMDggNzEuNjY2NyAyNzguNDE5IDc3LjAwNCAyNzguNDE5IDg1LjExNDNDMjc4LjQxOSA5My4yMjQ1IDI3My4zMDggOTguNTYxOCAyNjUuNTY2IDk4LjU2MThDMjU3LjgyMyA5OC41NjE4IDI1Mi43MTIgOTMuMjI0NSAyNTIuNzEyIDg1LjExNDNaTTI0My45ODMgODUuMTE0M0MyNDMuOTgzIDk3Ljk2NTUgMjUyLjg2MSAxMDYuOTcgMjY1LjU2NiAxMDYuOTdDMjc4LjI3IDEwNi45NyAyODcuMTQ4IDk3Ljk2NTUgMjg3LjE0OCA4NS4xMTQzQzI4Ny4xNDggNzIuMjYzMSAyNzguMjcgNjMuMjU4MyAyNjUuNTY2IDYzLjI1ODNDMjUyLjg2MSA2My4yNTgzIDI0My45ODMgNzIuMjYzMSAyNDMuOTgzIDg1LjExNDNaTTE2Mi41MjYgODUuMTQ0MUMxNjIuNTI2IDc3LjAzMzggMTY3LjYzOCA3MS42OTY1IDE3NS4zOCA3MS42OTY1QzE4My4xMjIgNzEuNjk2NSAxODguMjM0IDc3LjAzMzggMTg4LjIzNCA4NS4xNDQxQzE4OC4yMzQgOTMuMjU0MyAxODMuMTIyIDk4LjU5MTYgMTc1LjM4IDk4LjU5MTZDMTY3LjYzOCA5OC41OTE2IDE2Mi41MjYgOTMuMjU0MyAxNjIuNTI2IDg1LjE0NDFaTTE1My43OTcgODUuMTQ0MUMxNTMuNzk3IDk3Ljk5NTMgMTYyLjY3NSAxMDcgMTc1LjM4IDEwN0MxODguMDg0IDEwNyAxOTYuOTYyIDk3Ljk5NTMgMTk2Ljk2MiA4NS4xNDQxQzE5Ni45NjIgNzIuMjkyOSAxODguMDg0IDYzLjI4ODEgMTc1LjM4IDYzLjI4ODFDMTYyLjY3NSA2My4yODgxIDE1My43OTcgNzIuMjkyOSAxNTMuNzk3IDg1LjE0NDFaTTgzLjQzMDIgODUuMTE0M0M4My40MzAyIDc3LjAwNCA4OC41NDE4IDcxLjY2NjcgOTYuMjg0IDcxLjY2NjdDMTA0LjAyNiA3MS42NjY3IDEwOS4xMzggNzcuMDA0IDEwOS4xMzggODUuMTE0M0MxMDkuMTM4IDkzLjIyNDUgMTA0LjAyNiA5OC41NjE4IDk2LjI4NCA5OC41NjE4Qzg4LjU0MTggOTguNTYxOCA4My40MzAyIDkzLjIyNDUgODMuNDMwMiA4NS4xMTQzWk03NC43MDE1IDg1LjExNDNDNzQuNzAxNSA5Ny45NjU1IDgzLjU3OTYgMTA2Ljk3IDk2LjI4NCAxMDYuOTdDMTA4Ljk4OCAxMDYuOTcgMTE3Ljg2NiA5Ny45NjU1IDExNy44NjYgODUuMTE0M0MxMTcuODY2IDcyLjI2MzEgMTA4Ljk4OCA2My4yNTgzIDk2LjI4NCA2My4yNTgzQzgzLjU3OTYgNjMuMjU4MyA3NC43MDE1IDcyLjI2MzEgNzQuNzAxNSA4NS4xMTQzWk05LjcxNTA5IDg1LjExNDNWNzIuNTYxMkgxNy4wMzg4QzIxLjQ5MjggNzIuNTYxMiAyNC4xMjMzIDc0LjQzOTcgMjQuMTIzMyA3OC43MzM0QzI0LjEyMzMgODMuMDI3MSAyMS43OTE3IDg1LjExNDMgMTcuMzM3NyA4NS4xMTQzSDkuNzE1MDlaTTAuNTk3ODUxIDEwNi4wNDZIOS43MTUwOVY5My4zNzM2SDE3LjMzNzdDMjcuODg5OCA5My4zNzM2IDMyLjg4MTggODYuODEzOCAzMi44ODE4IDc4LjczMzRDMzIuODgxOCA3MC42NTI5IDI3Ljg4OTggNjQuMzAxOSAxNy4wMzg4IDY0LjMwMTlIMC41OTc4NTFWMTA2LjA0NlpNMjkyLjAyMSAxMDYuMDQ2SDMyMFY5Ni44OTJIMzAxLjIyN1Y2NC4yNzIxSDI5Mi4wMjFWMTA2LjA0NlpNMTMxLjQwOCAxMDYuMDQ2SDE0MC42MTVWNzIuNTMxNEgxNTMuODU3VjY0LjI3MjFIMTE4LjE5NVY3Mi41MzE0SDEzMS40MDhWMTA2LjA0NlpNNjEuOTM3NCA3OC43MzM0QzYxLjkzNzQgODMuMDI3MSA1OS42MDU4IDg1LjExNDMgNTUuMTUxOCA4NS4xMTQzSDQ2LjYzMjRWNzIuNTYxMkg1NC44NTI5QzU5LjMwNjkgNzIuNTYxMiA2MS45Mzc0IDc0LjQzOTcgNjEuOTM3NCA3OC43MzM0Wk0zNy41MTUyIDEwNi4wNDZINDYuNjMyNFY5My4zNzM2SDU1LjE1MThDNTUuNjYgOTMuMzczNiA1Ni4xNjgxIDkzLjM0MzggNTYuNjc2MyA5My4zMTRMNjMuMzQyNCAxMDYuMDQ2SDczLjA4NzNMNjQuOTI2NyA5MC43MTk5QzY4LjgxMjcgODguMDY2MiA3MC42OTU5IDgzLjY4MyA3MC42OTU5IDc4LjczMzRDNzAuNjk1OSA3MC42NTI5IDY1LjcwMzkgNjQuMzAxOSA1NC44NTI5IDY0LjMwMTlIMzcuNTE1MlYxMDYuMDQ2Wk0yMjEuNzQzIDEwN0MyMzIuNDQ1IDEwNyAyNDAuMDA3IDEwMC4zMjEgMjQxLjMyMyA5MC4zNjIxSDIzMi41MDRDMjMxLjMzOSA5NS41NTAzIDIyNy4yMTMgOTguNTkxNiAyMjEuNTM0IDk4LjU5MTZDMjE0LjEyIDk4LjU5MTYgMjA5LjQ1NyA5My4yNTQzIDIwOS40NTcgODUuMTE0M0MyMDkuNDU3IDc2Ljk3NDIgMjE0LjE1IDcxLjgxNTggMjIxLjQ0NCA3MS44MTU4QzIyNy4xMjQgNzEuODE1OCAyMzAuOTggNzQuODI3MyAyMzIuMjA2IDc5Ljg2NjRIMjQxLjAyNEMyMzkuMjkgNjkuOTk3IDIzMS41MTggNjMuMjU4MyAyMjEuMjY1IDYzLjI1ODNDMjA5LjIxOCA2My4yNTgzIDIwMC43MjkgNzIuNTMxNCAyMDAuNzI5IDg1LjE0NDFDMjAwLjcyOSA5Ny42OTcxIDIwOS4xMjggMTA3IDIyMS43NDMgMTA3WiIKICAgIGZpbGw9IndoaXRlIiAvPgo8L3N2Zz4KICAgIA=="
          alt=""
        />
      </div>
    ),
    {
      width: width,
      height: height,
    },
  );
}
