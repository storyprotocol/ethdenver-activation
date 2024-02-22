import { ChapterRelationship } from "@/interface/chapterRelationShipResponse";

export const generateChartData = (data: ChapterRelationship[]) => {
  const categories: { base: string; name: string }[] = [];
  const links: { source: string; target: string }[] = [];
  const nodes: { category: number; id: string; name: string }[] = [];
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
    forceOpt = {
      edgeLength: [10, 20],
      repulsion: 20,
      gravity: 0.3,
      zoom: 1,
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
      show: true,
      position: "top",
      padding: 16,
      renderMode: "html",
      className: "break-normal w-80",
      formatter: function (params: any) {
        return `<div style="display: block; max-width: 200px; font-size: 14px; color: #282828;">
        <img style="display: inline-block" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swXzY1NF8xMDIwIiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPgo8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNEOUQ5RDkiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swXzY1NF8xMDIwKSI+CjxwYXRoIGQ9Ik03LjYxNTU2IDEyLjg2MzRWOC4yOTY3TDMuNjE1NTYgNS45ODAwNFYxMC41NDY3TDcuNjE1NTYgMTIuODYzNFpNOC45NDg4OSAxMi44NjM0TDEyLjk0ODkgMTAuNTQ2N1Y1Ljk4MDA0TDguOTQ4ODkgOC4yOTY3VjEyLjg2MzRaTTguMjgyMjMgNy4xNDY3TDEyLjIzMjIgNC44NjMzN0w4LjI4MjIzIDIuNTgwMDRMNC4zMzIyMyA0Ljg2MzM3TDguMjgyMjMgNy4xNDY3Wk0yLjk0ODg5IDExLjcxMzRDMi43Mzc3OCAxMS41OTExIDIuNTczODkgMTEuNDMgMi40NTcyMyAxMS4yM0MyLjM0MDU2IDExLjAzIDIuMjgyMjMgMTAuODA3OCAyLjI4MjIzIDEwLjU2MzRWNS4yNjMzN0MyLjI4MjIzIDUuMDE4OTMgMi4zNDA1NiA0Ljc5NjcgMi40NTcyMyA0LjU5NjdDMi41NzM4OSA0LjM5NjcgMi43Mzc3OCA0LjIzNTU5IDIuOTQ4ODkgNC4xMTMzN0w3LjYxNTU2IDEuNDMwMDRDNy44MjY2NyAxLjMwNzgyIDguMDQ4ODkgMS4yNDY3IDguMjgyMjMgMS4yNDY3QzguNTE1NTYgMS4yNDY3IDguNzM3NzggMS4zMDc4MiA4Ljk0ODg5IDEuNDMwMDRMMTMuNjE1NiA0LjExMzM3QzEzLjgyNjcgNC4yMzU1OSAxMy45OTA2IDQuMzk2NyAxNC4xMDcyIDQuNTk2N0MxNC4yMjM5IDQuNzk2NyAxNC4yODIyIDUuMDE4OTMgMTQuMjgyMiA1LjI2MzM3VjEwLjU2MzRDMTQuMjgyMiAxMC44MDc4IDE0LjIyMzkgMTEuMDMgMTQuMTA3MiAxMS4yM0MxMy45OTA2IDExLjQzIDEzLjgyNjcgMTEuNTkxMSAxMy42MTU2IDExLjcxMzRMOC45NDg4OSAxNC4zOTY3QzguNzM3NzggMTQuNTE4OSA4LjUxNTU2IDE0LjU4IDguMjgyMjMgMTQuNThDOC4wNDg4OSAxNC41OCA3LjgyNjY3IDE0LjUxODkgNy42MTU1NiAxNC4zOTY3TDIuOTQ4ODkgMTEuNzEzNFoiIGZpbGw9IiMyODI4MjgiLz4KPC9nPgo8L3N2Zz4K" />
        <div style="display: inline-block; opacity: 0.5; font-size: 12px;">${params.data.name}</div>
        <br/>It was over in the blink of an eye. But for
        <br/> Hoffman, it felt like an eternity. The world
        <br/> seemed to stop like Dr. Horrible’s freeze ray
        <br/> had exploded.</div>`;
      },
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
          node.cursor = "default";
          if (highlightId) {
            node.itemStyle = {
              cursor: "pointer",
            };
          }
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
  if (dataLength < 30) {
    zoom = 3;
  } else if (dataLength < 50) {
    zoom = 2;
  } else if (dataLength < 100) {
    zoom = 1;
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
