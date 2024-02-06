"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { init, EChartsType } from "echarts";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface GraphChartProps {
  className?: string;
  highlightId?: string;
}

export default function GraphChart(props: GraphChartProps) {
  const { className, highlightId } = props;
  const [allData, setAllData] = useState([]);
  const lastId = useRef(0);
  const [gravity, setGravity] = useState(0.3);
  const domRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsType>();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 769px) and (max-width : 992px)",
  );
  const isLargeDevice = useMediaQuery(
    "only screen and (min-width : 993px) and (max-width : 1200px)",
  );
  const isExtraLargeDevice = useMediaQuery(
    "only screen and (min-width : 1201px)",
  );

  const getData = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/chapters/relationship?lastId=${lastId.current}&limit=10000`,
      );
      const data = await response.json();
      if (data.chapters && data.chapters.length) {
        const dataLastId = data.chapters[data.chapters.length - 1].id;
        if (lastId.current !== dataLastId) {
          lastId.current = dataLastId;
          setAllData((d) => d.concat(data.chapters));
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    getData();
    const intervalId = setInterval(() => {
      getData();
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [getData]);

  const defaultChartData = (data: any[]) => {
    const categories: any[] = [];
    const links: any[] = [];
    const nodes: any[] = [];
    data.forEach((chapter) => {
      const categoriesIdList = categories.map((item) => item.name);
      if (!categoriesIdList.includes(chapter.story_id)) {
        categories.push({
          base: chapter.story_id,
          name: chapter.story_id,
        });
        categoriesIdList.push(chapter.story_id);
      }
      if (chapter.parent_id !== 0) {
        links.push({
          source: chapter.id,
          target: chapter.parent_id,
        });
      }
      nodes.push({
        category: categoriesIdList.indexOf(chapter.story_id),
        id: chapter.id,
      });
    });
    return {
      categories,
      links,
      nodes,
    };
  };

  useEffect(() => {
    setGravity(0.4);
  }, [isSmallDevice]);

  useEffect(() => {
    setGravity(0.3);
  }, [isMediumDevice]);

  useEffect(() => {
    setGravity(0.2);
  }, [isLargeDevice]);

  useEffect(() => {
    setGravity(0.1);
  }, [isExtraLargeDevice]);

  useEffect(() => {
    if (domRef && domRef.current && allData) {
      const chartData = defaultChartData(allData);
      chartRef.current = init(domRef.current);
      const option = {
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
            label: {
              show: false,
            },
            data: chartData.nodes.map(function (node: any, idx: number) {
              node.id = idx;
              node.legendHoverLink = false;
              if (String(node.id) === highlightId) {
                node.symbolSize = 20;
                node.label = {
                  show: true,
                  formatter: "{a|}",
                  position: "top",
                  rich: {
                    a: {
                      width: 32,
                      height: 32,
                      align: "top",
                      // backgroundColor: {
                      //   image: shareIconPic.src,
                      // },
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
              edgeLength: [10, 50],
              repulsion: 20,
              gravity: gravity,
              layoutAnimation: true,
            },
            edges: chartData.links,
          },
        ],
      };
      chartRef.current.setOption(option);
    }
    () => {
      chartRef.current?.dispose();
    };
  }, [allData, domRef, highlightId, gravity]);

  useEffect(() => {
    window.addEventListener("resize", function () {
      chartRef.current?.resize();
    });
    return () => {
      window.removeEventListener("resize", function () {
        chartRef.current?.resize();
      });
    };
  }, []);

  return <div className={className} ref={domRef}></div>;
}
