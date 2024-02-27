import { ChapterRelationship } from "@/interface/chapterRelationShipResponse";

export const generateChartData = (data: ChapterRelationship[]) => {
  const categories: { base: string; name: string }[] = [];
  const links: { source: string; target: string }[] = [];
  const nodes: { category: number; id: string; name: string; desc: string }[] =
    [];
  let dataLastId = 0;
  data.forEach((chapter) => {
    const categoriesIdList = categories.map((item) => item.name);
    const story_id = String(chapter.story_id);
    const parent_id = String(chapter.parent_id);
    const id = String(chapter.id);
    if (dataLastId < Number(id)) {
      dataLastId = Number(id);
    }
    if (!categoriesIdList.includes(story_id)) {
      categories.push({
        base: story_id,
        name: story_id,
      });
      categoriesIdList.push(story_id);
    }
    if (parent_id !== "0") {
      links.push({
        source: id,
        target: parent_id,
      });
    }
    nodes.push({
      category: categoriesIdList.indexOf(story_id),
      id: id,
      name: chapter.wallet_address?.slice(0, 8),
      desc: chapter.content,
    });
  });

  return {
    categories,
    links,
    nodes,
    dataLastId,
  };
};

export const generateChartOption = ({
  chartData,
  highlightId = "",
  isTv = false,
  isSmallDevice = false,
  isMediumDevice = false,
}: {
  chartData: {
    categories: { base: string; name: string }[];
    links: { source: string; target: string }[];
    nodes: { category: number; id: string }[];
  };
  highlightId?: string;
  isTv?: boolean;
  isSmallDevice?: boolean;
  isMediumDevice?: boolean;
}) => {
  let forceOpt = {
    edgeLength: [10, 50],
    repulsion: 20,
    gravity: 0.3,
    zoom: 1,
  };

  if (isSmallDevice) {
    let zoom = 1;
    if (chartData.nodes.length < 100) {
      zoom = Math.max(
        Number(
          (100 / chartData.nodes.length > 3
            ? 3
            : 100 / chartData.nodes.length
          ).toFixed(1),
        ),
        0.5,
      );
    }
    forceOpt = {
      edgeLength: [10, 20],
      repulsion: 20,
      gravity: 0.3,
      zoom: zoom,
    };
  } else if (isMediumDevice) {
    const opt = getGravity(chartData.nodes.length);
    forceOpt = {
      edgeLength: opt.edgeLength,
      repulsion: opt.repulsion,
      gravity: opt.gravity,
      zoom: opt.zoom,
    };
  }

  return {
    legend: {
      show: false,
    },
    tooltip: {
      show: false,
    },
    itemStyle: {
      cursor: "default",
    },
    animation: true,
    series: [
      {
        type: "graph",
        layout: "force",
        animation: true,
        draggable: false,
        roam: true,
        zoom: !isTv ? forceOpt.zoom : 1,
        scaleLimit: {
          min: 0.5,
          max: 3,
        },
        label: {
          show: false,
        },
        lineStyle: {
          color: "rgba(255,255,255,0.65)",
          width: 2,
        },
        data: chartData.nodes.map(function (node: any) {
          node.itemStyle = {
            cursor: "pointer",
          };
          node.tooltip = {
            show: true,
            position: "top",
            triggerOn: "mousemove",
            enterable: "true",
            padding: 16,
            renderMode: "html",
            className: "",
            formatter: function (params: any) {
              return `<div style="display: block; font-size: 14px; max-width: 340px; color: #282828; tab-size: 0;">
              <img style="display: inline-block" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxtYXNrIGlkPSJtYXNrMF83MjNfODI3IiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIgogICAgICAgIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRDlEOUQ5IiAvPgogICAgPC9tYXNrPgogICAgPGcgbWFzaz0idXJsKCNtYXNrMF83MjNfODI3KSI+CiAgICAgICAgPHBhdGgKICAgICAgICAgICAgZD0iTTcuNjE1NTYgMTIuODYzNFY4LjI5NjdMMy42MTU1NiA1Ljk4MDA0VjEwLjU0NjdMNy42MTU1NiAxMi44NjM0Wk04Ljk0ODg5IDEyLjg2MzRMMTIuOTQ4OSAxMC41NDY3VjUuOTgwMDRMOC45NDg4OSA4LjI5NjdWMTIuODYzNFpNOC4yODIyMyA3LjE0NjdMMTIuMjMyMiA0Ljg2MzM3TDguMjgyMjMgMi41ODAwNEw0LjMzMjIzIDQuODYzMzdMOC4yODIyMyA3LjE0NjdaTTIuOTQ4ODkgMTEuNzEzNEMyLjczNzc4IDExLjU5MTEgMi41NzM4OSAxMS40MyAyLjQ1NzIzIDExLjIzQzIuMzQwNTYgMTEuMDMgMi4yODIyMyAxMC44MDc4IDIuMjgyMjMgMTAuNTYzNFY1LjI2MzM3QzIuMjgyMjMgNS4wMTg5MyAyLjM0MDU2IDQuNzk2NyAyLjQ1NzIzIDQuNTk2N0MyLjU3Mzg5IDQuMzk2NyAyLjczNzc4IDQuMjM1NTkgMi45NDg4OSA0LjExMzM3TDcuNjE1NTYgMS40MzAwNEM3LjgyNjY3IDEuMzA3ODIgOC4wNDg4OSAxLjI0NjcgOC4yODIyMyAxLjI0NjdDOC41MTU1NiAxLjI0NjcgOC43Mzc3OCAxLjMwNzgyIDguOTQ4ODkgMS40MzAwNEwxMy42MTU2IDQuMTEzMzdDMTMuODI2NyA0LjIzNTU5IDEzLjk5MDYgNC4zOTY3IDE0LjEwNzIgNC41OTY3QzE0LjIyMzkgNC43OTY3IDE0LjI4MjIgNS4wMTg5MyAxNC4yODIyIDUuMjYzMzdWMTAuNTYzNEMxNC4yODIyIDEwLjgwNzggMTQuMjIzOSAxMS4wMyAxNC4xMDcyIDExLjIzQzEzLjk5MDYgMTEuNDMgMTMuODI2NyAxMS41OTExIDEzLjYxNTYgMTEuNzEzNEw4Ljk0ODg5IDE0LjM5NjdDOC43Mzc3OCAxNC41MTg5IDguNTE1NTYgMTQuNTggOC4yODIyMyAxNC41OEM4LjA0ODg5IDE0LjU4IDcuODI2NjcgMTQuNTE4OSA3LjYxNTU2IDE0LjM5NjdMMi45NDg4OSAxMS43MTM0WiIKICAgICAgICAgICAgZmlsbD0iI0Q5RDlEOSIgLz4KICAgIDwvZz4KPC9zdmc+CiAgICA=" />
              <div style="display: inline-block; opacity: 0.5; font-size: 12px;">${params.data.name}</div>
              <div style="display: block; max-width: 100%; word-break: normal; word-wrap: normal; white-space: normal; tab-size: 0;">${params.data.desc}</div>
              </div>`;
            },
          };
          if (String(node.id) === highlightId) {
            node.itemStyle = {
              borderCap: "round",
              borderWidth: 3,
              borderColor: "#fff",
              cursor: "pointer",
            };
            node.label = {
              show: true,
              formatter: "{a|You}",
              position: "right",
              padding: [0, 0, 0, 0],
              rich: {
                a: {
                  /**
                   * In order to render echarts correctly on the server side when
                   * generating the og/twitter image, we need to set a fixed font-family.
                   * The fontFamily can be any value, BUT IT MUST BE SAME AS THE
                   * value in registerFont(node-canvas) when generate the og/twitter
                   */
                  fontFamily: "Roboto, sans-serif",
                  color: "#fff",
                  fontSize: "24px",
                  fontWeight: "bold",
                },
              },
            };
          } else {
            node.label = {
              show: false,
            };
          }
          return node;
        }),
        categories: chartData.categories,
        force: {
          ...(!isTv
            ? forceOpt
            : {
                edgeLength: [10, 55],
                repulsion: 55,
                gravity: 0.1,
              }),
          layoutAnimation: true,
        },
        edges: chartData.links,
      },
    ],
  };
};

export const getGravity = (dataLength: number) => {
  let zoom = 1;
  if (dataLength < 120) {
    zoom = Math.max(
      Number((120 / dataLength > 3 ? 3 : 120 / dataLength).toFixed(1)),
      0.5,
    );
  } else {
    zoom = Math.max(Number((1 - dataLength / 10000).toFixed(1)), 0.5);
  }
  return {
    gravity: Math.min(Number((dataLength / 2000).toFixed(1)) || 0.2, 0.4),
    edgeLength: [
      10,
      Math.max(Number((40 - Math.ceil(dataLength / 200) * 8).toFixed(0)), 25),
    ],
    repulsion: Math.max(
      Number((40 - Math.ceil(dataLength / 200) * 8).toFixed(0)),
      25,
    ),
    zoom,
  };
};
