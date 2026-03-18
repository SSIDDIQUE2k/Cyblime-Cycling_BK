import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Instagram } from "lucide-react";

export default function Gallery() {
  useEffect(() => {
    // Load Elfsight script
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#2A2A2A] to-[#1a1a1a] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#A4FF4F] blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Instagram className="w-12 h-12 text-[#A4FF4F]" />
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Gallery
              </h1>
            </div>
            <p className="text-xl text-gray-400">
              Explore moments from our rides, events, and community adventures
            </p>
          </motion.div>
        </div>
      </section>

      {/* Instagram Gallery - Elfsight Embed */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="elfsight-app-2d8d00ba-72e1-4194-ac43-a42805e820de" data-elfsight-app-lazy></div>
        </div>
      </section>

      {/* Additional Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[#2A2A2A] mb-4">
              Share Your Moments
            </h2>
            <p className="text-lg text-[#555555] max-w-2xl mx-auto">
              Tag us in your cycling photos and be featured in our gallery. 
              Use <span className="font-semibold text-[#ff6b35]">#CyblimeCycling</span> to join the community showcase.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}