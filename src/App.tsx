import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";



const queryClient = new QueryClient();

import LoadingScreen from "@/components/ui/LoadingScreen";
import { CreditsDialog } from "@/components/CreditsDialog";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import GyroscopePermission from "@/components/GyroscopePermission";
import { useState } from "react";

const App = () => {
  const [gyroEnabled, setGyroEnabled] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Gyroscope permission prompt for iOS devices */}
        <GyroscopePermission onPermissionGranted={() => setGyroEnabled(true)} />

        {/* Lightweight animated background - always visible behind everything */}
        <BackgroundCanvas gyroEnabled={gyroEnabled} />
        <LoadingScreen />
        <CreditsDialog />
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index gyroEnabled={gyroEnabled} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
