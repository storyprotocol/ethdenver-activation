"use client";

import { useEffect } from "react";

export default function ClearGraphPage() {
  useEffect(() => {
    sessionStorage.clear();
  }, []);
  return null;
}
