import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Trophy, Star, Gift } from "lucide-react";
import { motion } from "framer-motion";

export default function UnlocksDisplay({ user, userPoints }) {
  const { data: allUnlocks = [] } = useQuery({
    queryKey: ['unlockableContent'],
    queryFn: () => base44.entities.UnlockableContent.list()
  });

  const { data: userUnlocks = [] } = useQuery({
    queryKey: ['userUnlocks', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.UserUnlock.filter({ user_email: user.email });
    },
    enabled: !!user
  });

  const checkUnlocked = (unlock) => {
    const { unlock_requirement, unlock_value } = unlock;
    
    switch (unlock_requirement) {
      case 'level':
        return (userPoints?.level || 1) >= unlock_value;
      case 'points':
        return (userPoints?.total_points || 0) >= unlock_value;
      default:
        return false;
    }
  };

  const unlockedContent = allUnlocks.filter(u => checkUnlocked(u));
  const lockedContent = allUnlocks.filter(u => !checkUnlocked(u));

  const iconMap = {
    route: Trophy,
    badge: Star,
    feature: Unlock,
    discount: Gift
  };

  return (
    <div className="space-y-6">
      {/* Unlocked Content */}
      {unlockedContent.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Unlock className="w-5 h-5 text-[#A4FF4F]" />
            Unlocked ({unlockedContent.length})
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {unlockedContent.map((unlock, index) => {
              const Icon = iconMap[unlock.content_type] || Trophy;
              return (
                <motion.div
                  key={unlock.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 border-[#A4FF4F] bg-gradient-to-br from-[#A4FF4F]/10 to-white">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#A4FF4F] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{unlock.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">{unlock.description}</p>
                          <Badge className="mt-2 bg-[#A4FF4F] text-white border-0">
                            Unlocked!
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Content */}
      {lockedContent.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-400" />
            Coming Soon ({lockedContent.length})
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {lockedContent.map((unlock, index) => {
              const Icon = iconMap[unlock.content_type] || Trophy;
              return (
                <Card key={unlock.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-300">{unlock.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{unlock.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {unlock.unlock_requirement === 'level' && `Level ${unlock.unlock_value}`}
                          {unlock.unlock_requirement === 'points' && `${unlock.unlock_value} points`}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}