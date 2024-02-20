import { ChapterRelationship } from "@/interface/chapterRelationShipResponse";

export const generateChartData = (data: ChapterRelationship[]) => {
  const categories: { base: string; name: string }[] = [];
  const links: { source: string; target: string }[] = [];
  const nodes: { category: number; id: string }[] = [];
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
      show: false,
    },
    Animation: true,
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
          opacity: 0.8,
        },
        data: chartData.nodes.map(function (node: any) {
          node.cursor = "default";
          if (String(node.id) === highlightId) {
            node.itemStyle = {
              borderCap: "round",
              borderWidth: 3,
              borderColor: "#fff",
            };
            node.label = {
              show: true,
              formatter: "{a|You}",
              position: "right",
              padding: [0, 0, 0, 0],
              rich: {
                a: {
                  fontFamily: "Arial, sans-serif",
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
    zoom: Math.max(Number((1 - dataLength / 10000).toFixed(1)), 0.5),
  };
};
