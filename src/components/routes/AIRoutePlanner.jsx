import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, TrendingUp, Mountain, Eye, Navigation, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AIRoutePlanner({ onRouteGenerated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedRoutes, setGeneratedRoutes] = useState(null);
  
  const [preferences, setPreferences] = useState({
    distance: "",
    difficulty: "Moderate",
    starting_point: "",
    scenery: "scenic",
    additional_notes: ""
  });

  const handleGenerate = async () => {
    if (!preferences.distance || !preferences.starting_point) {
      alert("Please fill in distance and starting point");
      return;
    }

    setLoading(true);
    try {
      const prompt = `Generate 3 optimized cycling route suggestions based on these preferences:
- Distance: ${preferences.distance} km
- Difficulty: ${preferences.difficulty}
- Starting Point: ${preferences.starting_point}
- Scenery Preference: ${preferences.scenery}
${preferences.additional_notes ? `- Additional Notes: ${preferences.additional_notes}` : ''}

For each route, provide:
1. Route name (creative and descriptive)
2. Brief description (2-3 sentences)
3. Estimated elevation gain (in meters)
4. Surface type (Paved/Gravel/Mixed)
5. Key highlights (3-4 points of interest along the route)
6. Elevation profile description (describe the terrain - flat, rolling hills, steep climbs, etc.)
7. Estimated time (in hours)
8. Start and end locations

Return as a JSON array of route objects.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            routes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  elevation_gain: { type: "number" },
                  surface_type: { type: "string" },
                  highlights: { type: "array", items: { type: "string" } },
                  elevation_profile: { type: "string" },
                  estimated_time: { type: "number" },
                  start_location: { type: "string" },
                  end_location: { type: "string" }
                }
              }
            }
          }
        }
      });

      setGeneratedRoutes(result.routes || []);
    } catch (error) {
      console.error("Error generating routes:", error);
      alert("Failed to generate routes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoute = async (route) => {
    try {
      const routeData = {
        name: route.name,
        description: route.description,
        distance: parseFloat(preferences.distance),
        elevation_gain: route.elevation_gain,
        difficulty: preferences.difficulty,
        surface_type: route.surface_type,
        start_location: route.start_location,
        end_location: route.end_location,
        estimated_time: route.estimated_time,
        highlights: route.highlights,
        is_public: true
      };

      await base44.entities.Route.create(routeData);
      alert("Route saved successfully!");
      setOpen(false);
      setGeneratedRoutes(null);
      if (onRouteGenerated) onRouteGenerated();
    } catch (error) {
      console.error("Error saving route:", error);
      alert("Failed to save route");
    }
  };

  const sceneryIcons = {
    scenic: Eye,
    challenging: Mountain,
    urban: Navigation
  };

  const SceneryIcon = sceneryIcons[preferences.scenery] || Eye;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Route Planner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            AI Route Planner
          </DialogTitle>
          <p className="text-sm text-gray-600">Let AI design the perfect cycling route for you</p>
        </DialogHeader>

        {!generatedRoutes ? (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Distance (km) *</Label>
                <Input
                  type="number"
                  placeholder="e.g., 30"
                  value={preferences.distance}
                  onChange={(e) => setPreferences({ ...preferences, distance: e.target.value })}
                />
              </div>

              <div>
                <Label>Difficulty *</Label>
                <Select value={preferences.difficulty} onValueChange={(value) => setPreferences({ ...preferences, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Challenging">Challenging</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Starting Point *</Label>
              <Input
                placeholder="e.g., Central Park, Manhattan"
                value={preferences.starting_point}
                onChange={(e) => setPreferences({ ...preferences, starting_point: e.target.value })}
              />
            </div>

            <div>
              <Label>Scenery Preference</Label>
              <Select value={preferences.scenery} onValueChange={(value) => setPreferences({ ...preferences, scenery: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scenic">Scenic Views</SelectItem>
                  <SelectItem value="challenging">Challenging Climbs</SelectItem>
                  <SelectItem value="urban">Urban Routes</SelectItem>
                  <SelectItem value="mixed">Mixed Terrain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Additional Notes (Optional)</Label>
              <Textarea
                placeholder="Any specific preferences or requirements..."
                value={preferences.additional_notes}
                onChange={(e) => setPreferences({ ...preferences, additional_notes: e.target.value })}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Routes...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Routes
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generated Route Suggestions</h3>
              <Button variant="outline" size="sm" onClick={() => setGeneratedRoutes(null)}>
                ← Back
              </Button>
            </div>

            {generatedRoutes.map((route, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-purple-100">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-purple-900">{route.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{route.description}</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-0">
                        Route {index + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600">Distance</div>
                        <div className="text-lg font-bold text-gray-900">{preferences.distance}km</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600">Elevation</div>
                        <div className="text-lg font-bold text-gray-900">{route.elevation_gain}m</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600">Time</div>
                        <div className="text-lg font-bold text-gray-900">{route.estimated_time}h</div>
                      </div>
                    </div>

                    {/* Locations */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Start:</span>
                        <span className="text-gray-600">{route.start_location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span className="font-semibold">End:</span>
                        <span className="text-gray-600">{route.end_location}</span>
                      </div>
                    </div>

                    {/* Elevation Profile */}
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-sm">Elevation Profile</span>
                      </div>
                      <p className="text-sm text-gray-700">{route.elevation_profile}</p>
                    </div>

                    {/* Highlights */}
                    <div>
                      <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Points of Interest
                      </div>
                      <ul className="space-y-1">
                        {route.highlights.map((highlight, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-purple-600 mt-1">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Surface & Difficulty */}
                    <div className="flex gap-2">
                      <Badge variant="outline">{route.surface_type}</Badge>
                      <Badge variant="outline">{preferences.difficulty}</Badge>
                    </div>

                    {/* Save Button */}
                    <Button 
                      onClick={() => handleSaveRoute(route)}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Save This Route
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}