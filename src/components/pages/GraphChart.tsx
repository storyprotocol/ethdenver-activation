"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { init, EChartsType } from "echarts";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Spinner from "./Spinner";
import axios, { all } from "axios";
import {
  ChapterRelationshipResponse,
  ChapterRelationship,
} from "@/interface/chapterRelationShipResponse";

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
    zoom: 1,
  });
  const domRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsType>();
  const isSmallDevice = useMediaQuery("(max-width : 768px)");
  const isMediumDevice = useMediaQuery("(min-width : 769px)");

  const getData = useCallback(async (abortCtrl: AbortController) => {
    try {
      const response = await axios.get<ChapterRelationshipResponse>(
        `/api/chapters/relationship?from_chapter_id=${lastId.current}&limit=10000`,
        {
          signal: abortCtrl.signal,
        },
      );
      const data = response.data;
      if (data.chapters && data.chapters.length) {
        const dataLastId = data.chapters[data.chapters.length - 1].id;
        if (lastId.current !== dataLastId) {
          setAllData((d) => d.concat(data.chapters));
        }
      }
      setIsLoading(false);
    } catch (e) {
      if (abortCtrl.signal.aborted) {
        return;
      }
      console.log(e);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortControl = new AbortController();
    setIsLoading(true);
    getData(abortControl);
    const intervalId = setInterval(() => {
      getData(abortControl);
    }, 5000);
    return () => {
      clearInterval(intervalId);
      abortControl.abort();
    };
  }, [getData]);

  const defaultChartData = (data: ChapterRelationship[]) => {
    const categories: { base: string; name: string }[] = [];
    const links: { source: string; target: string }[] = [];
    const nodes: { category: number; id: string }[] = [];
    let dataLastId = lastId.current;
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
    lastId.current = dataLastId;
    return {
      categories,
      links,
      nodes,
    };
  };

  const getGravity = useCallback((dataLength: number) => {
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
  }, []);

  useEffect(() => {
    if (isSmallDevice) {
      setForceOpt({
        edgeLength: [10, 20],
        repulsion: 20,
        gravity: 0.4,
        zoom: 1,
      });
    }
  }, [isSmallDevice, allData.length]);

  useEffect(() => {
    if (isMediumDevice) {
      const opt = getGravity(allData.length);
      setForceOpt({
        edgeLength: opt.edgeLength,
        repulsion: opt.repulsion,
        gravity: opt.gravity,
        zoom: opt.zoom,
      });
    }
  }, [allData.length, isMediumDevice, getGravity]);

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
