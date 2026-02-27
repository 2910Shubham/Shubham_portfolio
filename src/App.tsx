import { Switch, Route } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/views/home";
import GreenIslandPage from "@/views/green-island";
import NotFound from "@/views/not-found";
import Gallery from "@/views/gallery";
import StartupLoader from "@/components/startup-loader";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/green-island" component={GreenIslandPage} />
      <Route path="/gallery" component={Gallery} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    document.body.style.overflow = showLoader ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoader]);

  return (
    <>
      <StartupLoader visible={showLoader} onFinish={() => setShowLoader(false)} />
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
