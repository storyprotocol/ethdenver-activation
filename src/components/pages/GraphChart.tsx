"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { init, EChartsType } from "echarts";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Spinner from "./Spinner";
import axios from "axios";
import {
  ChapterRelationshipResponse,
  ChapterRelationship,
} from "@/interface/chapterRelationShipResponse";
import youAreHerePic from "@/assets/chapter/you_are_here.png";

interface GraphChartProps {
  className?: string;
  highlightId?: string;
  isTv?: boolean;
}

export default function GraphChart(props: GraphChartProps) {
  const { className, highlightId, isTv } = props;
  const [allData, setAllData] = useState<ChapterRelationship[]>([]);
  const lastId = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [forceOpt, setForceOpt] = useState({
    edgeLength: [10, 50],
    repulsion: 20,
    gravity: 0.3,
  });
  const domRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsType>();
  const isSmallDevice = useMediaQuery("(max-width : 768px)");
  const isMediumDevice = useMediaQuery("(min-width : 769px)");

  const getData = useCallback(async () => {
    try {
      const response = await axios.get<ChapterRelationshipResponse>(
        `/api/chapters/relationship?lastId=${lastId.current}&limit=10000`,
      );
      const data = response.data;
      if (data.chapters && data.chapters.length) {
        const dataLastId = data.chapters[data.chapters.length - 1].id;
        if (lastId.current !== dataLastId) {
          lastId.current = dataLastId;
          setAllData((d) => d.concat(data.chapters));
        }
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getData();
    const intervalId = setInterval(() => {
      getData();
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [getData]);

  const defaultChartData = (data: ChapterRelationship[]) => {
    const categories: { base: string; name: string }[] = [];
    const links: { source: string; target: string }[] = [];
    const nodes: { category: number; id: string }[] = [];
    const idList: string[] = [];
    data.forEach((chapter) => {
      const categoriesIdList = categories.map((item) => item.name);
      const story_id = String(chapter.story_id);
      const parent_id = String(chapter.parent_id);
      const id = String(chapter.id);
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
    };
  };

  useEffect(() => {
    if (isSmallDevice) {
      setForceOpt({
        edgeLength: [10, 20],
        repulsion: 20,
        gravity: 0.4,
      });
    }
  }, [isSmallDevice]);

  useEffect(() => {
    if (isMediumDevice) {
      setForceOpt({
        edgeLength: [10, 20],
        repulsion: 20,
        gravity: 0.3,
      });
    }
  }, [isMediumDevice]);

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
            data: chartData.nodes.map(function (node: any) {
              node.legendHoverLink = false;
              node.cursor = "default";
              if (String(node.id) === highlightId) {
                node.symbolSize = 20;
                node.label = {
                  show: true,
                  formatter: "{a|}",
                  position: "top",
                  padding: [0, 0, -8, 90],
                  rich: {
                    a: {
                      width: 80,
                      height: 80,
                      align: "top",
                      backgroundColor: {
                        image: youAreHerePic.src,
                      },
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
                    edgeLength: [10, 50],
                    repulsion: 50,
                    gravity: 0.2,
                  }),
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
  }, [allData, domRef, highlightId, forceOpt, isTv]);

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

  return (
    <>
      {isLoading && <Spinner />}
      <div className={className} ref={domRef}></div>
    </>
  );
}
