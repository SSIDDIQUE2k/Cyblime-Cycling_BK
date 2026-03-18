import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function StravaClub() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Top bar with branding and back navigation */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#2A2A2A] border-b border-[#FC4C02]/30 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-[#FC4C02] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="w-px h-6 bg-[#141414]/20" />
          <span className="text-white font-bold text-lg tracking-wide">
            CYB<span className="text-[#FC4C02]">LIME</span>
          </span>
        </div>
        <span className="text-white/50 text-sm">Strava Club</span>
      </div>

      {/* Strava iframe */}
      <iframe
        src="https://www.strava.com/clubs/762372?oq=cy"
        className="w-full flex-1 border-0"
        title="Strava Club Feed"
      />
    </div>
  );
}
