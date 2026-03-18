import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { getPersonalizedRecommendations } from "../components/recommendations/RecommendationEngine";
import RecommendedSection from "../components/recommendations/RecommendedSection";
import CommunityFeed from "../components/community/CommunityFeed";
import { 
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  ArrowRight,
  Compass,
  Heart,
  Users,
  Instagram
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Hero Slideshow Component
const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Ride Together, Grow Together",
      subtitle: "Join a community that pushes your limits and celebrates every milestone",
      image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1920&q=80"
    },
    {
      title: "Every Mile Tells a Story",
      subtitle: "Create unforgettable memories on scenic routes and epic adventures",
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&q=80"
    },
    {
      title: "Join the Journey",
      subtitle: "Discover the joy of cycling with riders who share your passion",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
                {slides[currentSlide].subtitle}
              </p>
              <Link to={createPageUrl("Events")}>
                <Button className="bg-[#c9a227] hover:bg-[#b89123] text-white rounded-full px-8 py-6 text-lg font-semibold">
                  Explore Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-[#c9a227] w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// Event Card Component
const EventCard = ({ event, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
    >
      {event.banner_image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.banner_image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-[#555555] mb-3">
          <Calendar className="w-4 h-4" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        
        <h3 className="text-xl font-bold text-[#2A2A2A] mb-3">{event.title}</h3>
        
        <div className="flex items-center gap-2 text-sm text-[#555555] mb-4">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[#555555] border-[#555555]/30">
              {event.level}
            </Badge>
            {event.distance && (
              <Badge variant="outline" className="text-[#555555] border-[#555555]/30">
                {event.distance}
              </Badge>
            )}
          </div>
          
          <Link to={createPageUrl("Events")} className="text-[#c9a227] font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View Details
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Value Card Component
const ValueCard = ({ icon: Icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="text-center"
    >
      <div className="w-20 h-20 rounded-full bg-[#c9a227] flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-[#2A2A2A] mb-4">{title}</h3>
      <p className="text-[#555555] leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.log("Not authenticated");
      }
    };
    fetchUser();

    // Load Elfsight script for Instagram gallery
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user) return null;
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0] || null;
    },
    enabled: !!user
  });

  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', user?.email],
    queryFn: () => getPersonalizedRecommendations(user, profile, {}),
    enabled: !!user && !!profile
  });

  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      const allEvents = await base44.entities.Event.list('-date', 3);
      return allEvents.filter(e => e.status === 'published' && new Date(e.date) >= new Date());
    }
  });

  const values = [
    {
      icon: Compass,
      title: "Adventure Awaits",
      description: "We explore new routes, discover hidden trails, and push boundaries together. Every ride is an opportunity for discovery."
    },
    {
      icon: Heart,
      title: "Community First",
      description: "At the heart of Cymblime is a supportive community where friendships are forged and every rider is valued."
    },
    {
      icon: Users,
      title: "All Levels Welcome",
      description: "Whether you're a beginner or a seasoned pro, you'll find your pace and your people at Cymblime."
    }
  ];

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80",
      span: "col-span-2 row-span-2"
    },
    {
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      span: "col-span-1 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80",
      span: "col-span-1 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=400&q=80",
      span: "col-span-1 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=400&q=80",
      span: "col-span-1 row-span-1"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Section 1: Hero Slideshow */}
      <HeroSlideshow />

      {/* Personalized Recommendations */}
      {user && recommendations && (
        <RecommendedSection recommendations={recommendations} profile={profile} />
      )}

      {/* Section 2: Featured Events */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-[#2A2A2A]"
            >
              Upcoming Rides
            </motion.h2>
            <Link 
              to={createPageUrl("Events")} 
              className="text-[#c9a227] font-medium flex items-center gap-2 hover:gap-3 transition-all"
            >
              View all events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No upcoming events at the moment</p>
              <Link to={createPageUrl("Events")}>
                <Button className="bg-[#c9a227] hover:bg-[#b89123] text-white">
                  Browse All Events
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Club Values */}
      <section className="py-24 bg-[#f5f5f3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] mb-6">
              What We Stand For
            </h2>
            <p className="text-lg text-[#555555]">
              Cymblime is built on the belief that cycling brings people together, 
              challenges us to grow, and opens doors to incredible experiences.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Community Feed */}
      <CommunityFeed />

      {/* Section 5: Instagram Gallery */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white border-0">
              <Instagram className="w-3 h-3 mr-1" />
              Instagram
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] mb-4">
              Moments from the Road
            </h2>
            <p className="text-xl text-[#555555] max-w-2xl mx-auto">
              Experience the journey through the lens of our community
            </p>
          </motion.div>

          <style>{`
            .elfsight-app-70900cfe-1ff2-4b28-a832-f9790890ec6d {
              overflow: hidden !important;
            }
            .elfsight-app-70900cfe-1ff2-4b28-a832-f9790890ec6d * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            .elfsight-app-70900cfe-1ff2-4b28-a832-f9790890ec6d *::-webkit-scrollbar {
              display: none !important;
            }
          `}</style>
          <div className="elfsight-app-70900cfe-1ff2-4b28-a832-f9790890ec6d" data-elfsight-app-lazy></div>

          <div className="text-center mt-8">
            <Link to={createPageUrl("Gallery")}>
              <Button className="bg-[#2A2A2A] hover:bg-[#1a1a1a] text-white rounded-full px-8 py-6 text-lg">
                View Full Gallery
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Final CTA */}
      <section className="relative py-32 bg-[#1a1a1a] overflow-hidden">
        {/* Dot Grid Texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ready to Join the Pack?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Become part of a community that rides together, grows together, and creates unforgettable memories on every journey.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={createPageUrl("Events")}>
                <Button className="bg-[#c9a227] hover:bg-[#b89123] text-white rounded-full px-10 py-6 text-lg font-semibold">
                  Browse Events
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}