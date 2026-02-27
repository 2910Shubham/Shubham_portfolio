"use client";

import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import StartupLoader from "@/components/startup-loader";
import { queryClient } from "@/lib/queryClient";

type ClientRootProps = {
  children: React.ReactNode;
};

export default function ClientRoot({ children }: ClientRootProps) {
  const [showLoader, setShowLoader] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showLoader ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoader]);

  return (
    <>
      {mounted && <StartupLoader visible={showLoader} onFinish={() => setShowLoader(false)} />}
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}
