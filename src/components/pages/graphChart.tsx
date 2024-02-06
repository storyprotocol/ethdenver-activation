"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as echarts from "echarts";

interface GraphChartProps {
  className?: string;
  highlightId?: string;
}

export default function GraphChart(props: GraphChartProps) {
  const { className, highlightId } = props;
  const [allData, setAllData] = useState([]);
  const lastId = useRef(0);
  const chartRef = useRef(null);

  const getData = useCallback(async () => {
    const response = await fetch(
      `/api/chapters?lastId=${lastId.current}&limit=10000`,
    );
    const data = await response.json();
    if (data.chapters && data.chapters.length) {
      const dataLastId = data.chapters[data.chapters.length - 1].id;
      if (lastId.current !== dataLastId) {
        lastId.current = dataLastId;
        setAllData((d) => d.concat(data.chapters));
      }
    }
  }, []);

  useEffect(() => {
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
    if (chartRef && allData && allData.length) {
      const chartData = defaultChartData(allData);
      const myChart = echarts.init(chartRef.current);
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
              gravity: 0.3,
              layoutAnimation: true,
            },
            edges: chartData.links,
          },
        ],
      };
      myChart.setOption(option);
    }
  }, [allData, chartRef, highlightId]);

  return <div className={className} ref={chartRef}></div>;
}
