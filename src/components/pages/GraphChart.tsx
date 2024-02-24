"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { init, EChartsType } from "echarts";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
import axios from "axios";
import {
  ChapterRelationshipResponse,
  ChapterRelationship,
} from "@/interface/chapterRelationShipResponse";
import { generateChartData, generateChartOption } from "@/lib/chartUtils";

interface GraphChartProps {
  className?: string;
  highlightId?: string;
  isTv?: boolean;
  disablePolling?: boolean;
}

export default function GraphChart(props: GraphChartProps) {
  const router = useRouter();
  const { className, highlightId, isTv, disablePolling } = props;
  const [allData, setAllData] = useState<ChapterRelationship[]>([]);
  const lastId = useRef(0);
  const intervalId = useRef<NodeJS.Timeout>();
  const [isLoading, setIsLoading] = useState(true);
  const domRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsType>();
  const isSmallDevice = useMediaQuery("(max-width : 768px)");
  const isMediumDevice = useMediaQuery("(min-width : 769px)");

  const getData = useCallback(
    async (abortCtrl: AbortController) => {
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
        if (disablePolling && !data.chapters.length) {
          clearInterval(intervalId.current);
        }
        setIsLoading(false);
      } catch (e) {
        if (abortCtrl.signal.aborted) {
          return;
        }
        console.log(e);
        setIsLoading(false);
      }
    },
    [disablePolling],
  );

  useEffect(() => {
    const abortControl = new AbortController();
    setIsLoading(true);
    getData(abortControl);
    intervalId.current = setInterval(() => {
      getData(abortControl);
    }, 5000);
    return () => {
      clearInterval(intervalId.current);
      abortControl.abort();
    };
  }, [getData]);

  useEffect(() => {
    if (domRef && domRef.current) {
      chartRef.current = init(domRef.current);
      chartRef.current.on("click", (e) => {
        const id = (e.data as unknown as { id: string }).id;
        if (id) {
          router.push(
            `/graph?highlight_id=${id}&timestamp=${new Date().getTime()}`,
          );
        }
      });
    }
    return () => {
      chartRef.current?.dispose();
    };
  }, [domRef, highlightId, router]);

  useEffect(() => {
    if (chartRef.current && allData) {
      const chartData = generateChartData(allData);
      if (lastId.current < chartData.dataLastId) {
        lastId.current = chartData.dataLastId;
      }

      const option = generateChartOption({
        chartData,
        highlightId,
        isTv,
        isSmallDevice,
        isMediumDevice,
      });
      chartRef.current.setOption(option);
    }
  }, [allData, chartRef, highlightId, isMediumDevice, isSmallDevice, isTv]);

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
