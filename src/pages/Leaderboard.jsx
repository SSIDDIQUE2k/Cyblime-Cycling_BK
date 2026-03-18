import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp, Calendar, Map, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LeaderboardCard = ({ rank, user, points, level, badges, metric }) => {
  const getRankIcon = () => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-700" />;
    return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`p-4 rounded-xl ${rank <= 3 ? 'bg-gradient-to-r from-[#c9a227]/10 to-transparent border-2 border-[#c9a227]/20' : 'bg-white border border-gray-200'}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 flex items-center justify-center">
          {getRankIcon()}
        </div>
        
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a227] to-[#b89123] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">
            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{user.full_name || user.email.split('@')[0]}</p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="outline" className="text-xs">Level {level}</Badge>
            {badges > 0 && (
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                {badges} badges
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-[#c9a227]">{metric}</p>
          <p className="text-xs text-gray-500">points</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Leaderboard() {
  const [timeFrame, setTimeFrame] = useState("all");

  const { data: leaderboardData = [] } = useQuery({
    queryKey: ['leaderboard', timeFrame],
    queryFn: async () => {
      const [userPoints, users, achievements] = await Promise.all([
        base44.entities.UserPoints.list('-total_points', 50),
        base44.entities.User.list(),
        base44.entities.Achievement.list()
      ]);

      return userPoints.map(points => {
        const user = users.find(u => u.email === points.user_email);
        const userBadges = achievements.filter(a => a.user_email === points.user_email);
        return {
          ...points,
          user,
          badgeCount: userBadges.length
        };
      }).filter(item => item.user);
    }
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ['activeChallenges'],
    queryFn: async () => {
      const allChallenges = await base44.entities.Challenge.list();
      const now = new Date();
      return allChallenges.filter(c => 
        c.active && 
        new Date(c.start_date) <= now && 
        new Date(c.end_date) >= now
      );
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a227] to-[#b89123] mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Leaderboard</h1>
            <p className="text-xl text-gray-600">
              Compete with fellow cyclists and climb to the top!
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Active Challenges */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#c9a227]" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {challenges.length > 0 ? (
                challenges.map(challenge => (
                  <div key={challenge.id} className="p-3 rounded-lg bg-gradient-to-r from-[#c9a227]/10 to-transparent border-l-4 border-[#c9a227]">
                    <p className="font-semibold text-sm text-gray-900">{challenge.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{challenge.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">{challenge.reward_points} pts</Badge>
                      <span className="text-xs text-gray-500">
                        Ends {new Date(challenge.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No active challenges</p>
              )}
            </CardContent>
          </Card>

          {/* Top 3 Podium */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Cyclists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-center gap-4 mb-8">
                {leaderboardData.slice(0, 3).map((item, index) => {
                  const positions = [1, 0, 2];
                  const actualRank = positions[index] + 1;
                  const heights = ['h-32', 'h-40', 'h-24'];
                  const colors = ['bg-gray-300', 'bg-yellow-400', 'bg-amber-700'];
                  
                  return (
                    <motion.div
                      key={item.user.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`flex flex-col items-center ${index === 1 ? 'order-1' : index === 0 ? 'order-2' : 'order-3'}`}
                    >
                      <div className="relative mb-2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a227] to-[#b89123] flex items-center justify-center border-4 border-white shadow-lg">
                          <span className="text-white font-bold text-2xl">
                            {item.user.full_name?.charAt(0) || item.user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {actualRank === 1 && (
                          <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-500" />
                        )}
                      </div>
                      <p className="font-semibold text-sm text-center mb-1">
                        {item.user.full_name || item.user.email.split('@')[0]}
                      </p>
                      <div className={`${heights[index]} ${colors[index]} w-24 rounded-t-lg flex items-center justify-center flex-col px-2`}>
                        <p className="text-2xl font-bold text-gray-900">{item.total_points}</p>
                        <p className="text-xs text-gray-700">points</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Full Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Time</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-3">
              {leaderboardData.map((item, index) => (
                <LeaderboardCard
                  key={item.id}
                  rank={index + 1}
                  user={item.user}
                  points={item.total_points}
                  level={item.level}
                  badges={item.badgeCount}
                  metric={item.total_points}
                />
              ))}
              
              {leaderboardData.length === 0 && (
                <p className="text-center text-gray-500 py-8">No rankings yet. Be the first to earn points!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}