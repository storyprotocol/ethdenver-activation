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
import { generateChartData, generateChartOption } from "@/lib/chartUtils";

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

  useEffect(() => {
    if (domRef && domRef.current) {
      chartRef.current = init(domRef.current);
    }
    return () => {
      chartRef.current?.dispose();
    };
  }, [domRef]);

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
