"use client";

import React from "react";
import { SWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";

export const SWRProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};
