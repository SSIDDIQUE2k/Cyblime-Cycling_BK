import Home from './pages/Home';
import Events from './pages/Events';
import About from './pages/About';
import Membership from './pages/Membership';
import Routes from './pages/Routes';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Blog from './pages/Blog';
import AdminEvents from './pages/AdminEvents';
import AdminModeration from './pages/AdminModeration';
import AdminBlog from './pages/AdminBlog';
import AdminPanel from './pages/AdminPanel';
import Challenges from './pages/Challenges';
import BlogPost from './pages/BlogPost';
import AuthorPosts from './pages/AuthorPosts';
import RouteDetails from './pages/RouteDetails';
import StravaClub from './pages/StravaClub';
import CyclingHub from './pages/CyclingHub';
import MyProgress from './pages/MyProgress';
import Gallery from './pages/Gallery';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminInstagramSettings from './pages/AdminInstagramSettings';
import AdminBlogManagement from './pages/AdminBlogManagement';
import AdminEventManagement from './pages/AdminEventManagement';
import AdminRouteManagement from './pages/AdminRouteManagement';
import AdminForumManagement from './pages/AdminForumManagement';
import MyEvents from './pages/MyEvents';
import Leaderboard from './pages/Leaderboard';
import AdminChallengeManagement from './pages/AdminChallengeManagement';
import TeamChallengesPage from './pages/TeamChallengesPage';
import Login from './pages/Login';
import AdminPageContent from './pages/AdminPageContent';
import AdminSiteSettings from './pages/AdminSiteSettings';
import AdminTestimonials from './pages/AdminTestimonials';
import __Layout from './Layout.jsx';


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