import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import {
  MapPin,
  TrendingUp,
  Mountain,
  Star,
  Activity,
  Trophy,
  Users,
  Calendar,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PremiumLoader from "../components/cycling/PremiumLoader";
import StravaEmbed from "../components/cycling/StravaEmbed";

const RouteCard = ({ route, index }) => {
  const difficultyColors = {
    Easy: "bg-[#A4FF4F] text-[#2A2A2A]",
    Moderate: "bg-yellow-400 text-[#2A2A2A]",
    Challenging: "bg-orange-500 text-white",
    Expert: "bg-red-600 text-white"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={route.map_image_url || "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80"}
          alt={route.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <Badge className={`absolute top-4 left-4 ${difficultyColors[route.difficulty]} border-0 font-semibold`}>
          {route.difficulty}
        </Badge>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-[#2A2A2A] flex-1">{route.name}</h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-[#c9a227] text-[#c9a227]" />
            <span className="font-semibold">{route.rating || "5.0"}</span>
          </div>
        </div>
        
        <p className="text-sm text-[#555555] mb-4 line-clamp-2">{route.description}</p>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-[#FC4C02]" />
            <span className="text-[#555555]">{route.distance}km</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-[#FC4C02]" />
            <span className="text-[#555555]">{route.elevation_gain}m</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mountain className="w-4 h-4 text-[#FC4C02]" />
            <span className="text-[#555555]">{route.surface_type}</span>
          </div>
        </div>
        
        <Link to={createPageUrl("RouteDetails") + `?id=${route.id}`}>
          <Button className="w-full bg-[#FC4C02] hover:bg-[#E34402] text-white rounded-xl">
            View Route
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default function CyclingHub() {
  const [activeTab, setActiveTab] = useState("routes");
  const [isLoadingTab, setIsLoadingTab] = useState(false);

  const { data: routes = [], isLoading: routesLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: () => base44.entities.Route.list('-created_date'),
    initialData: []
  });

  const handleTabChange = (value) => {
    setIsLoadingTab(true);
    setActiveTab(value);
    setTimeout(() => setIsLoadingTab(false), 1000);
  };

  const featuredRoutes = routes.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <PremiumLoader isLoading={routesLoading || isLoadingTab} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#FC4C02] to-[#FF7A00] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Cycling Hub
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Your complete cycling experience: routes, community, and achievements all in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FC4C02] mb-1">{routes.length}</div>
              <div className="text-sm text-[#555555]">Routes Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FC4C02] mb-1">150+</div>
              <div className="text-sm text-[#555555]">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FC4C02] mb-1">5,000+</div>
              <div className="text-sm text-[#555555]">Weekly km</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FC4C02] mb-1">250+</div>
              <div className="text-sm text-[#555555]">Group Rides</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-8 bg-white p-2 rounded-2xl shadow-sm">
              <TabsTrigger 
                value="routes" 
                className="rounded-xl data-[state=active]:bg-[#FC4C02] data-[state=active]:text-white px-6 py-3"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Featured Routes
              </TabsTrigger>
              <TabsTrigger 
                value="feed" 
                className="rounded-xl data-[state=active]:bg-[#FC4C02] data-[state=active]:text-white px-6 py-3"
              >
                <Activity className="w-4 h-4 mr-2" />
                Club Feed
              </TabsTrigger>
              <TabsTrigger 
                value="activities" 
                className="rounded-xl data-[state=active]:bg-[#FC4C02] data-[state=active]:text-white px-6 py-3"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Recent Activities
              </TabsTrigger>
              <TabsTrigger 
                value="leaderboard" 
                className="rounded-xl data-[state=active]:bg-[#FC4C02] data-[state=active]:text-white px-6 py-3"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="rounded-xl data-[state=active]:bg-[#FC4C02] data-[state=active]:text-white px-6 py-3"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Events
              </TabsTrigger>
            </TabsList>

            {/* Routes Tab */}
            <TabsContent value="routes" className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-[#2A2A2A]">Featured Routes</h2>
                <Link to={createPageUrl("Routes")}>
                  <Button variant="outline" className="rounded-full">
                    View All Routes
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredRoutes.map((route, index) => (
                  <RouteCard key={route.id} route={route} index={index} />
                ))}
              </div>
            </TabsContent>

            {/* Club Feed Tab */}
            <TabsContent value="feed" className="h-[calc(100vh-250px)]">
              <iframe
                src="https://www.strava.com/clubs/762372?oq=cy"
                className="w-full h-full border-0"
                title="Strava Club Feed"
              />
            </TabsContent>

            {/* Recent Activities Tab */}
            <TabsContent value="activities" className="h-[calc(100vh-250px)]">
              <iframe
                src="https://www.strava.com/clubs/762372?oq=cy"
                className="w-full h-full border-0"
                title="Strava Recent Activities"
              />
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="h-[calc(100vh-250px)]">
              <iframe
                src="https://www.strava.com/clubs/762372?oq=cy"
                className="w-full h-full border-0"
                title="Strava Leaderboard"
              />
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="h-[calc(100vh-250px)]">
              <iframe
                src="https://www.strava.com/clubs/762372?oq=cy"
                className="w-full h-full border-0"
                title="Strava Events"
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#2A2A2A] to-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Join the Ride?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Discover new routes, connect with riders, and track your progress.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to={createPageUrl("Routes")}>
                <Button className="bg-[#FC4C02] hover:bg-[#E34402] text-white rounded-full px-8 py-6 text-lg">
                  Explore Routes
                </Button>
              </Link>
              <a href="https://www.strava.com/clubs/762372" target="_blank" rel="noopener noreferrer">
                <Button className="bg-white text-[#2A2A2A] hover:bg-gray-100 border-2 border-white rounded-full px-8 py-6 text-lg font-semibold">
                  <Users className="w-5 h-5 mr-2" />
                  Join Club
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}