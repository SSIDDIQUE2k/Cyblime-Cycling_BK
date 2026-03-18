import { lazy } from 'react';
import __Layout from './Layout.jsx';

// Lazy-load every page — only downloads when the user navigates there
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const About = lazy(() => import('./pages/About'));
const Membership = lazy(() => import('./pages/Membership'));
const Routes = lazy(() => import('./pages/Routes'));
const Profile = lazy(() => import('./pages/Profile'));
const Community = lazy(() => import('./pages/Community'));
const Blog = lazy(() => import('./pages/Blog'));
const AdminEvents = lazy(() => import('./pages/AdminEvents'));
const AdminModeration = lazy(() => import('./pages/AdminModeration'));
const AdminBlog = lazy(() => import('./pages/AdminBlog'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Challenges = lazy(() => import('./pages/Challenges'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const AuthorPosts = lazy(() => import('./pages/AuthorPosts'));
const RouteDetails = lazy(() => import('./pages/RouteDetails'));
const StravaClub = lazy(() => import('./pages/StravaClub'));
const CyclingHub = lazy(() => import('./pages/CyclingHub'));
const MyProgress = lazy(() => import('./pages/MyProgress'));
const Gallery = lazy(() => import('./pages/Gallery'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const AdminInstagramSettings = lazy(() => import('./pages/AdminInstagramSettings'));
const AdminBlogManagement = lazy(() => import('./pages/AdminBlogManagement'));
const AdminEventManagement = lazy(() => import('./pages/AdminEventManagement'));
const AdminRouteManagement = lazy(() => import('./pages/AdminRouteManagement'));
const AdminForumManagement = lazy(() => import('./pages/AdminForumManagement'));
const MyEvents = lazy(() => import('./pages/MyEvents'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const AdminChallengeManagement = lazy(() => import('./pages/AdminChallengeManagement'));
const TeamChallengesPage = lazy(() => import('./pages/TeamChallengesPage'));
const Login = lazy(() => import('./pages/Login'));
const AdminPageContent = lazy(() => import('./pages/AdminPageContent'));
const AdminSiteSettings = lazy(() => import('./pages/AdminSiteSettings'));
const AdminTestimonials = lazy(() => import('./pages/AdminTestimonials'));

export const PAGES = {
    "Home": Home,
    "Events": Events,
    "About": About,
    "Membership": Membership,
    "Routes": Routes,
    "Profile": Profile,
    "Community": Community,
    "Blog": Blog,
    "AdminEvents": AdminEvents,
    "AdminModeration": AdminModeration,
    "AdminBlog": AdminBlog,
    "AdminPanel": AdminPanel,
    "Challenges": Challenges,
    "BlogPost": BlogPost,
    "AuthorPosts": AuthorPosts,
    "RouteDetails": RouteDetails,
    "StravaClub": StravaClub,
    "CyclingHub": CyclingHub,
    "MyProgress": MyProgress,
    "Gallery": Gallery,
    "AdminDashboard": AdminDashboard,
    "AdminAnalytics": AdminAnalytics,
    "AdminInstagramSettings": AdminInstagramSettings,
    "AdminBlogManagement": AdminBlogManagement,
    "AdminEventManagement": AdminEventManagement,
    "AdminRouteManagement": AdminRouteManagement,
    "AdminForumManagement": AdminForumManagement,
    "MyEvents": MyEvents,
    "Leaderboard": Leaderboard,
    "AdminChallengeManagement": AdminChallengeManagement,
    "TeamChallengesPage": TeamChallengesPage,
    "Login": Login,
    "AdminPageContent": AdminPageContent,
    "AdminSiteSettings": AdminSiteSettings,
    "AdminTestimonials": AdminTestimonials,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
