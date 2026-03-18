import React, { useState, useEffect } from "react";
import { Activity, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StravaEmbed({ 
  src, 
  title, 
  height = "600px",
  fallbackButton = "Open on Strava",
  fallbackUrl = "https://www.strava.com/clubs/762372"
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    const timeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 15000);

    return () => clearTimeout(timeout);
  }, [src]);

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    window.location.reload();
  };

  if (hasError) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-12 text-center" style={{ minHeight: height }}>
        <div className="max-w-md mx-auto">
          <Activity className="w-16 h-16 text-[#FC4C02] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[#2A2A2A] mb-2">Unable to Load</h3>
          <p className="text-[#555555] mb-6">
            We couldn't load the {title} section. Please try again or visit Strava directly.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleRetry}
              variant="outline"
              className="rounded-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Loading
            </Button>
            <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#FC4C02] hover:bg-[#E34402] text-white rounded-full">
                {fallbackButton}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="w-12 h-12 border-4 border-[#FC4C02] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <iframe
        src={src}
        className="w-full h-full border-0"
        style={{ minHeight: height }}
        title={title}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}