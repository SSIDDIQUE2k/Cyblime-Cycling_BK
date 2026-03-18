-- ============================================
-- CYBLIME CYCLING CLUB - SUPABASE SCHEMA
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USER PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  goals JSONB DEFAULT '[]',
  saved_routes TEXT[] DEFAULT '{}',
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. EVENTS
-- ============================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('ride', 'trip', 'workshop', 'social')),
  date TEXT,
  time TEXT,
  location TEXT,
  level TEXT DEFAULT 'All Levels',
  distance TEXT,
  max_participants INTEGER,
  price NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  organizer_email TEXT,
  banner_image_url TEXT,
  created_by TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. EVENT RSVPs
-- ============================================
CREATE TABLE public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  event_name TEXT,
  event_date TEXT,
  status TEXT DEFAULT 'interested' CHECK (status IN ('going', 'maybe', 'interested')),
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_by TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. EVENT REGISTRATIONS
-- ============================================
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  event_name TEXT,
  event_date TEXT,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_by TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. ROUTES
-- ============================================
CREATE TABLE public.routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  distance NUMERIC(10,2),
  elevation_gain NUMERIC(10,2),
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Moderate', 'Challenging', 'Expert')),
  surface_type TEXT CHECK (surface_type IN ('Paved', 'Gravel', 'Mixed', 'Mountain Trail')),
  start_location TEXT,
  end_location TEXT,
  map_image_url TEXT,
  video_url TEXT,
  gpx_file_url TEXT,
  estimated_time NUMERIC(5,2),
  is_public BOOLEAN DEFAULT TRUE,
  rating NUMERIC(3,2) DEFAULT 0,
  total_rides INTEGER DEFAULT 0,
  highlights TEXT[] DEFAULT '{}',
  created_by TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. ROUTE COMMENTS
-- ============================================
CREATE TABLE public.route_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. BLOG POSTS
-- ============================================
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  category TEXT CHECK (category IN ('news', 'tips', 'stories', 'gear', 'training')),
  published BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_by TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. BLOG COMMENTS
-- ============================================
CREATE TABLE public.blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. CHALLENGES
-- ============================================
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('weekly', 'monthly')),
  active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  reward_points INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. TEAM CHALLENGES
-- ============================================
CREATE TABLE public.team_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  team_name TEXT,
  description TEXT,
  goal_type TEXT,
  goal_value NUMERIC(10,2),
  current_progress NUMERIC(10,2) DEFAULT 0,
  team_members TEXT[] DEFAULT '{}',
  max_members INTEGER DEFAULT 5,
  reward_points INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. FORUM POSTS
-- ============================================
CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'routes', 'gear', 'training', 'maintenance', 'events')),
  reply_count INTEGER DEFAULT 0,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  is_pinned BOOLEAN DEFAULT FALSE,
  created_by TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. FORUM REPLIES
-- ============================================
CREATE TABLE public.forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. NOTIFICATIONS
-- ============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  title TEXT,
  message TEXT,
  type TEXT CHECK (type IN ('event_reminder', 'new_event', 'event_update', 'challenge', 'badge')),
  related_id TEXT,
  action_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. ACHIEVEMENTS
-- ============================================
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  badge_type TEXT,
  title TEXT,
  description TEXT,
  icon TEXT,
  points_awarded INTEGER DEFAULT 0,
  date_achieved TIMESTAMPTZ DEFAULT NOW(),
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 15. USER POINTS
-- ============================================
CREATE TABLE public.user_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  weekly_points INTEGER DEFAULT 0,
  monthly_points INTEGER DEFAULT 0,
  routes_uploaded INTEGER DEFAULT 0,
  total_elevation NUMERIC(10,2) DEFAULT 0,
  reviews_left INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 16. BADGES
-- ============================================
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 17. BUDDIES
-- ============================================
CREATE TABLE public.buddies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  buddy_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  motivation_message TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 18. REPORTS
-- ============================================
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT CHECK (content_type IN ('post', 'reply', 'comment')),
  content_id TEXT,
  reason TEXT CHECK (reason IN ('spam', 'inappropriate', 'harassment', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_by TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 19. UNLOCKABLE CONTENT
-- ============================================
CREATE TABLE public.unlockable_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT CHECK (content_type IN ('route', 'badge', 'feature', 'discount')),
  unlock_requirement TEXT CHECK (unlock_requirement IN ('level', 'points')),
  unlock_value INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 20. USER UNLOCKS
-- ============================================
CREATE TABLE public.user_unlocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  unlockable_id UUID REFERENCES public.unlockable_content(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 21. TICKETS
-- ============================================
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  event_name TEXT,
  ticket_type TEXT CHECK (ticket_type IN ('general', 'early_bird', 'vip')),
  price NUMERIC(10,2),
  ticket_id TEXT UNIQUE,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'cancelled')),
  stripe_payment_id TEXT,
  created_by TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 22. STRAVA SETTINGS
-- ============================================
CREATE TABLE public.strava_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enabled BOOLEAN DEFAULT FALSE,
  placement TEXT DEFAULT 'routes_tab' CHECK (placement IN ('routes_tab', 'dedicated_page', 'both')),
  section_title TEXT,
  club_url TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 23. INSTAGRAM SETTINGS
-- ============================================
CREATE TABLE public.instagram_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  access_token TEXT,
  grid_columns INTEGER DEFAULT 3,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  max_posts INTEGER DEFAULT 9,
  enabled BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_created_by ON public.events(created_by);
CREATE INDEX idx_event_rsvps_event ON public.event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_user ON public.event_rsvps(created_by);
CREATE INDEX idx_event_registrations_user ON public.event_registrations(created_by);
CREATE INDEX idx_routes_difficulty ON public.routes(difficulty);
CREATE INDEX idx_routes_public ON public.routes(is_public);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_created_by ON public.blog_posts(created_by);
CREATE INDEX idx_blog_comments_post ON public.blog_comments(post_id);
CREATE INDEX idx_forum_posts_category ON public.forum_posts(category);
CREATE INDEX idx_forum_posts_pinned ON public.forum_posts(is_pinned);
CREATE INDEX idx_forum_replies_post ON public.forum_replies(post_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_email);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_achievements_user ON public.achievements(user_email);
CREATE INDEX idx_user_points_email ON public.user_points(user_email);
CREATE INDEX idx_user_points_total ON public.user_points(total_points DESC);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_buddies_user ON public.buddies(user_email);
CREATE INDEX idx_buddies_buddy ON public.buddies(buddy_email);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_tickets_event ON public.tickets(event_id);
CREATE INDEX idx_tickets_user ON public.tickets(created_by);
CREATE INDEX idx_challenges_active ON public.challenges(active);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlockable_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strava_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies (anyone can view published content)
CREATE POLICY "Anyone can view published events" ON public.events FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can view routes" ON public.routes FOR SELECT USING (is_public = TRUE OR auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (published = TRUE OR auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can view challenges" ON public.challenges FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view team challenges" ON public.team_challenges FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view forum posts" ON public.forum_posts FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view forum replies" ON public.forum_replies FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view unlockable content" ON public.unlockable_content FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view leaderboard" ON public.user_points FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view blog comments" ON public.blog_comments FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view route comments" ON public.route_comments FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view strava settings" ON public.strava_settings FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view instagram settings" ON public.instagram_settings FOR SELECT USING (TRUE);

-- AUTHENTICATED USER policies
CREATE POLICY "Auth users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can update own profile" ON public.user_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Auth users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Auth users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can update own events" ON public.events FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can delete own events" ON public.events FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can RSVP" ON public.event_rsvps FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can register" ON public.event_registrations FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can manage routes" ON public.routes FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can comment routes" ON public.route_comments FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can manage blog posts" ON public.blog_posts FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can comment blogs" ON public.blog_comments FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can post in forum" ON public.forum_posts FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can reply in forum" ON public.forum_replies FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users own notifications" ON public.notifications FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users own achievements" ON public.achievements FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users own points" ON public.user_points FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users own badges" ON public.badges FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users manage buddies" ON public.buddies FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can report" ON public.reports FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users own unlocks" ON public.user_unlocks FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can buy tickets" ON public.tickets FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users manage strava" ON public.strava_settings FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users manage instagram" ON public.instagram_settings FOR ALL USING (auth.uid() IS NOT NULL);

-- ============================================
-- STORAGE BUCKET for file uploads
-- ============================================
-- Run this separately in Supabase dashboard or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);
