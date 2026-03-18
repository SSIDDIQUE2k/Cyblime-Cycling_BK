import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import TeamChallenges from "../components/gamification/TeamChallenges";
import BuddySystem from "../components/gamification/BuddySystem";
import UnlocksDisplay from "../components/gamification/UnlocksDisplay";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Heart, Trophy } from "lucide-react";

export default function TeamChallengesPage() {
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
  }, []);

  const { data: userPoints } = useQuery({
    queryKey: ['userPoints', user?.email],
    queryFn: async () => {
      if (!user) return null;
      const points = await base44.entities.UserPoints.filter({ user_email: user.email });
      return points[0] || null;
    },
    enabled: !!user
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--cy-bg)] flex items-center justify-center">
        <p className="text-[var(--cy-text-muted)]">Please log in to view team challenges</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cy-bg)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2A2A2A] to-[#1a1a1a] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#ff6b35] blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--cy-text)] tracking-tight mb-6">
              Team Up & Compete
            </h1>
            <p className="text-xl text-[var(--cy-text-muted)]">
              Join team challenges, connect with buddies, and unlock exclusive rewards
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Tabs defaultValue="teams" className="space-y-8">
            <TabsList className="bg-[var(--cy-bg-card)] p-1 rounded-xl shadow-none">
              <TabsTrigger value="teams" className="rounded-lg data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Team Challenges
              </TabsTrigger>
              <TabsTrigger value="buddies" className="rounded-lg data-[state=active]:bg-[#6BCBFF] data-[state=active]:text-[var(--cy-text)]">
                <Heart className="w-4 h-4 mr-2" />
                Buddies
              </TabsTrigger>
              <TabsTrigger value="unlocks" className="rounded-lg data-[state=active]:bg-[#A4FF4F] data-[state=active]:text-black">
                <Trophy className="w-4 h-4 mr-2" />
                Unlocks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teams">
              <TeamChallenges user={user} />
            </TabsContent>

            <TabsContent value="buddies">
              <BuddySystem user={user} />
            </TabsContent>

            <TabsContent value="unlocks">
              <UnlocksDisplay user={user} userPoints={userPoints} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}