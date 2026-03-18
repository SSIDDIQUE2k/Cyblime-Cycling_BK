import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

async function getPersonalizedEvents(user, profile, registrations) {
  if (!user) return [];

  const allEvents = await base44.entities.Event.list('-date');
  const upcomingEvents = allEvents.filter(e => 
    e.status === 'published' && new Date(e.date) >= new Date()
  );

  // Score events based on user preferences
  const scoredEvents = upcomingEvents.map(event => {
    let score = 0;

    // Prefer user's skill level
    if (profile?.skill_level && event.level === profile.skill_level) {
      score += 10;
    }

    // Prefer events not already registered for
    const alreadyRegistered = registrations?.some(r => r.event_id === event.id);
    if (!alreadyRegistered) {
      score += 5;
    }

    // Prefer upcoming events (sooner = higher score)
    const daysUntil = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7) score += 8;
    else if (daysUntil <= 14) score += 5;
    else if (daysUntil <= 30) score += 3;

    // Prefer popular events
    if (event.current_participants > 10) score += 3;

    // Match with user's favorite discipline
    if (profile?.favorite_discipline) {
      if (event.type === 'ride' && profile.favorite_discipline.includes('Road')) score += 5;
      if (event.type === 'trip' && profile.favorite_discipline.includes('Gravel')) score += 5;
    }

    return { ...event, aiScore: score };
  });

  return scoredEvents
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 3);
}

export default function ForYouSection({ user, profile, onEventClick }) {
  const { data: registrations = [] } = useQuery({
    queryKey: ['userRegistrations', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.EventRegistration.filter({ created_by: user.email });
    },
    enabled: !!user
  });

  const { data: recommendedEvents = [], isLoading } = useQuery({
    queryKey: ['forYouEvents', user?.email, profile?.skill_level],
    queryFn: () => getPersonalizedEvents(user, profile, registrations),
    enabled: !!user
  });

  if (!user || isLoading || recommendedEvents.length === 0) return null;

  return (
    <section className="mb-8">
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-bold text-[#2A2A2A]">For You</h3>
            <Badge className="bg-purple-600 text-white border-0">AI Powered</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Events matched to your preferences and riding style
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {recommendedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 border border-purple-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">{event.type}</Badge>
                  <Badge className="bg-purple-100 text-purple-800 border-0 text-xs">
                    Match: {Math.round((event.aiScore / 30) * 100)}%
                  </Badge>
                </div>
                
                <h4 className="font-semibold text-[#2A2A2A] mb-2">{event.title}</h4>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    <span>{event.current_participants || 0} going</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                  size="sm"
                >
                  View Details
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}