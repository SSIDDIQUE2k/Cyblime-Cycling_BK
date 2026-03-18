import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Loader2, AlertCircle, X, Play, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

const InstagramLightbox = ({ media, onClose, allMedia, currentIndex, onNavigate }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < allMedia.length - 1) onNavigate(currentIndex + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, allMedia.length, onClose, onNavigate]);

  if (!media) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <span className="text-white text-2xl">‹</span>
        </button>
      )}

      {currentIndex < allMedia.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <span className="text-white text-2xl">›</span>
        </button>
      )}

      <div onClick={(e) => e.stopPropagation()} className="max-w-5xl w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {media.media_type === "VIDEO" ? (
            <video
              src={media.media_url}
              controls
              autoPlay
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          ) : (
            <img
              src={media.media_url}
              alt={media.caption || "Instagram post"}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          )}
          
          {media.caption && (
            <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg">
              <p className="text-white text-sm leading-relaxed">{media.caption}</p>
            </div>
          )}
          
          <a
            href={media.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
          >
            <Instagram className="w-4 h-4" />
            View on Instagram
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

const InstagramPost = ({ media, onClick, index, columns }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative aspect-square bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}
        
        <img
          src={media.media_type === "VIDEO" ? media.thumbnail_url : media.media_url}
          alt={media.caption || "Instagram post"}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
          }`}
        />
        
        {media.media_type === "VIDEO" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-[#ff6b35] ml-1" />
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            {media.caption && (
              <p className="text-white text-sm line-clamp-2 font-medium">
                {media.caption}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function InstagramGallery() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings?.access_token) {
      fetchInstagramMedia();
    }
  }, [settings]);

  const fetchSettings = async () => {
    try {
      const settingsList = await base44.entities.InstagramSettings.list();
      if (settingsList.length > 0) {
        setSettings(settingsList[0]);
      } else {
        setError("Instagram not configured. Please contact admin.");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to load settings");
      setLoading(false);
    }
  };

  const fetchInstagramMedia = async () => {
    const cacheKey = "instagram_media_cache";
    const cacheTimeKey = "instagram_media_cache_time";
    const cacheExpiry = 1000 * 60 * 30; // 30 minutes

    try {
      // Check cache first
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(cacheTimeKey);
      
      if (cachedData && cachedTime) {
        const age = Date.now() - parseInt(cachedTime);
        if (age < cacheExpiry) {
          setMedia(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      const response = await fetch(
        `https://graph.instagram.com/v17.0/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${settings.access_token}&limit=${settings.max_posts || 24}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Instagram media");
      }

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        setMedia(data.data);
        // Cache the results
        localStorage.setItem(cacheKey, JSON.stringify(data.data));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
      } else {
        setError("No posts found");
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Instagram fetch error:", err);
      setError("Failed to load Instagram posts. Please check your connection.");
      setLoading(false);
    }
  };

  const openLightbox = (mediaItem, index) => {
    setSelectedMedia(mediaItem);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
  };

  const navigateMedia = (newIndex) => {
    setSelectedMedia(media[newIndex]);
    setSelectedIndex(newIndex);
  };

  if (!settings?.enabled) {
    return null;
  }

  const gridCols = {
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
  };

  return (
    <section className={`py-16 ${settings.theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#fafafa]'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <h2 className={`text-4xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-[#2A2A2A]'}`}>
              Follow Our Journey
            </h2>
          </div>
          <p className={`text-lg ${settings.theme === 'dark' ? 'text-gray-400' : 'text-[#555555]'} max-w-2xl mx-auto`}>
            Stay connected with our latest rides, adventures, and cycling community moments
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className={`w-12 h-12 animate-spin mb-4 ${settings.theme === 'dark' ? 'text-white' : 'text-[#ff6b35]'}`} />
            <p className={settings.theme === 'dark' ? 'text-gray-400' : 'text-[#555555]'}>
              Loading Instagram posts...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className={`text-lg mb-4 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-[#555555]'}`}>
              {error}
            </p>
            <Button
              onClick={fetchInstagramMedia}
              className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && media.length > 0 && (
          <>
            <div className={`grid ${gridCols[settings.grid_columns || 4]} gap-6`}>
              {media.map((item, index) => (
                <InstagramPost
                  key={item.id}
                  media={item}
                  onClick={() => openLightbox(item, index)}
                  index={index}
                  columns={settings.grid_columns}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <a
                href="https://www.instagram.com/cymblime_cycling_club/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white hover:opacity-90 rounded-full px-8 py-6 text-lg font-semibold">
                  <Instagram className="w-5 h-5 mr-2" />
                  Follow Us on Instagram
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </motion.div>
          </>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <InstagramLightbox
            media={selectedMedia}
            onClose={closeLightbox}
            allMedia={media}
            currentIndex={selectedIndex}
            onNavigate={navigateMedia}
          />
        )}
      </AnimatePresence>
    </section>
  );
}