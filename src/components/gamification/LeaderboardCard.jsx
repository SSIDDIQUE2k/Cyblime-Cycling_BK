import React from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LeaderboardCard({ leaders, title, type }) {
  const icons = {
    routes: TrendingUp,
    distance: Trophy,
    events: Award
  };
  
  const Icon = icons[type] || Trophy;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#c9a227] flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-[#2A2A2A]">{title}</h3>
      </div>

      <div className="space-y-3">
        {leaders.map((leader, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center justify-between p-3 rounded-xl ${
              index < 3 ? 'bg-gradient-to-r from-[#c9a227]/10 to-transparent' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-[#c9a227] text-white' :
                index === 1 ? 'bg-gray-300 text-[#2A2A2A]' :
                index === 2 ? 'bg-orange-300 text-[#2A2A2A]' :
                'bg-gray-100 text-[#555555]'
              }`}>
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-[#2A2A2A]">{leader.name}</div>
                <div className="text-xs text-[#555555]">{leader.stat}</div>
              </div>
            </div>
            <Badge variant="outline" className="font-semibold">
              {leader.value}
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
}