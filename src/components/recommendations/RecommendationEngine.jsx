import { base44 } from "@/api/base44Client";

export async function getPersonalizedRecommendations(user, profile, userActivity) {
  // Get user's skill level and favorite discipline
  const skillLevel = profile?.skill_level || "All Levels";
  const favoriteDiscipline = profile?.favorite_discipline || null;
  
  // Fetch all data
  const [routes, events, forumPosts] = await Promise.all([
    base44.entities.Route.list('-created_date', 50),
    base44.entities.Event ? base44.entities.Event.list('-date', 50) : [],
    base44.entities.ForumPost.list('-created_date', 50)
  ]);

  // Score routes based on user preferences
  const scoredRoutes = routes.map(route => {
    let score = 0;
    
    // Match difficulty with skill level
    if (skillLevel === "Beginner" && route.difficulty === "Easy") score += 30;
    if (skillLevel === "Intermediate" && ["Easy", "Moderate"].includes(route.difficulty)) score += 25;
    if (skillLevel === "Advanced" && ["Moderate", "Challenging"].includes(route.difficulty)) score += 25;
    if (skillLevel === "Expert" && ["Challenging", "Expert"].includes(route.difficulty)) score += 30;
    
    // Popularity bonus
    score += Math.min((route.total_rides || 0) * 0.5, 20);
    
    // Rating bonus
    score += (route.rating || 0) * 4;
    
    // Recent bonus
    const daysSinceCreated = (Date.now() - new Date(route.created_date)) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated < 7) score += 15;
    
    return { ...route, score };
  });

  // Score events based on user preferences
  const scoredEvents = events.map(event => {
    let score = 0;
    
    // Match skill level
    if (event.level === skillLevel || event.level === "All Levels") score += 25;
    
    // Match event type with user goals
    if (profile?.goals?.some(g => !g.completed && g.title.toLowerCase().includes('event'))) {
      score += 20;
    }
    
    // Upcoming events get priority
    const eventDate = new Date(event.date);
    const daysUntilEvent = (eventDate - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysUntilEvent > 0 && daysUntilEvent < 14) score += 30;
    
    return { ...event, score };
  });

  // Score forum posts based on interests
  const scoredPosts = forumPosts.map(post => {
    let score = 0;
    
    // Match category with user interests
    if (favoriteDiscipline) {
      if (post.category === "routes" && favoriteDiscipline !== "Track") score += 20;
      if (post.category === "training") score += 15;
    }
    
    // Active discussions (more replies)
    score += Math.min((post.reply_count || 0) * 2, 20);
    
    // Recent activity
    const daysSinceActivity = (Date.now() - new Date(post.last_activity || post.created_date)) / (1000 * 60 * 60 * 24);
    if (daysSinceActivity < 3) score += 15;
    
    return { ...post, score };
  });

  return {
    routes: scoredRoutes.sort((a, b) => b.score - a.score).slice(0, 6),
    events: scoredEvents.sort((a, b) => b.score - a.score).slice(0, 4),
    posts: scoredPosts.sort((a, b) => b.score - a.score).slice(0, 5)
  };
}