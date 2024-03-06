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
  const [isLoading, setIsLoading] = useState(true);
  const domRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsType>();
  const isSmallDevice = useMediaQuery("(max-width : 768px)");
  const isMediumDevice = useMediaQuery("(min-width : 769px)");
  const dataLimit = 10000;
  const displayDataLimit = 1000;

  const getData = useCallback(
    async (abortCtrl: AbortController) => {
      try {
        const response = await axios.get<ChapterRelationshipResponse>(
          `/api/chapters/relationship?from_chapter_id=${lastId.current}&limit=${dataLimit}`,
          {
            signal: abortCtrl.signal,
          },
        );
        const data = response.data;
        if (data.chapters && data.chapters.length) {
          setAllData(() => data.chapters.slice(0, displayDataLimit));
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
    return () => {
      abortControl.abort();
    };
  }, [getData]);

  useEffect(() => {
    if (domRef && domRef.current) {
      chartRef.current = init(domRef.current);
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
