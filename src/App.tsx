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
  const [permissionComplete, setPermissionComplete] = useState(false);

  const handlePermissionGranted = () => {
    setGyroEnabled(true);
    setPermissionComplete(true);
  };

  // Show only the permission prompt until permission is granted/skipped
  if (!permissionComplete) {
    return (
      <div className="bg-background min-h-screen">
        <GyroscopePermission onPermissionGranted={handlePermissionGranted} />
      </div>
    );
  }

  // After permission is handled, render the full app
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
