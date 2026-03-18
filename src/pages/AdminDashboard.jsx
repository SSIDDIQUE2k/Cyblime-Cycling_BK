import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import AdminLayout from "../components/admin/AdminLayout";
import {
  Users,
  FileText,
  Calendar,
  Map,
  TrendingUp,
  MessageSquare,
  Flag,
  Activity,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatCard = ({ icon: Icon, title, value, change, trend, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="relative overflow-hidden"
  >
    <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5 hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{value}</h3>
            {change && (
              <div className="flex items-center gap-2">
                {trend === 'up' ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-semibold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {change}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
              </div>
            )}
          </div>
          <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const QuickAction = ({ icon: Icon, label, onClick, color }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`p-4 rounded-2xl ${color} text-white flex flex-col items-center gap-2 hover:shadow-lg transition-all`}
  >
    <Icon className="w-6 h-6" />
    <span className="text-sm font-semibold">{label}</span>
  </motion.button>
);

const ActivityItem = ({ icon: Icon, title, description, time, color }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{description}</p>
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{time}</span>
  </div>
);

export default function AdminDashboard() {
  const { data: users = [] } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => base44.entities.User.list()
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['adminBlogPosts'],
    queryFn: () => base44.entities.BlogPost.list()
  });

  const { data: events = [] } = useQuery({
    queryKey: ['adminEvents'],
    queryFn: () => base44.entities.Event.list()
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['adminRoutes'],
    queryFn: () => base44.entities.Route.list()
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['adminReports'],
    queryFn: () => base44.entities.Report.list()
  });

  const pendingReports = reports.filter(r => r.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            title="Total Users"
            value={users.length}
            change={12.5}
            trend="up"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            icon={FileText}
            title="Blog Posts"
            value={posts.length}
            change={8.2}
            trend="up"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            icon={Calendar}
            title="Events"
            value={events.length}
            change={-3.1}
            trend="down"
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            icon={Flag}
            title="Pending Reports"
            value={pendingReports}
            change={null}
            trend={null}
            color="bg-gradient-to-br from-red-500 to-red-600"
          />
        </div>

        {/* Quick Actions */}
        <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5">
          <CardHeader>
            <CardTitle className="dark:text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickAction
                icon={FileText}
                label="New Post"
                color="bg-gradient-to-br from-[#c9a227] to-[#b89123]"
              />
              <QuickAction
                icon={Calendar}
                label="New Event"
                color="bg-gradient-to-br from-green-500 to-green-600"
              />
              <QuickAction
                icon={Map}
                label="New Route"
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <QuickAction
                icon={Flag}
                label="Moderation"
                color="bg-gradient-to-br from-red-500 to-red-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5">
            <CardHeader>
              <CardTitle className="dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ActivityItem
                icon={Users}
                title="New User Registered"
                description="john.doe@example.com joined"
                time="2m ago"
                color="bg-blue-500"
              />
              <ActivityItem
                icon={FileText}
                title="Blog Post Published"
                description="Winter Training Tips"
                time="1h ago"
                color="bg-purple-500"
              />
              <ActivityItem
                icon={Calendar}
                title="Event Created"
                description="Mountain Trail Ride - March 15"
                time="3h ago"
                color="bg-green-500"
              />
              <ActivityItem
                icon={Flag}
                title="New Report"
                description="Spam content reported"
                time="5h ago"
                color="bg-red-500"
              />
              <ActivityItem
                icon={Map}
                title="Route Uploaded"
                description="Coastal Loop - 45km"
                time="1d ago"
                color="bg-[#c9a227]"
              />
            </CardContent>
          </Card>

          {/* Popular Content */}
          <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5">
            <CardHeader>
              <CardTitle className="dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Popular This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{post.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{post.view_count || 0} views</span>
                      <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{post.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5">
          <CardHeader>
            <CardTitle className="dark:text-white">Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Map className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{routes.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Routes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Forum Posts</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.filter(p => p.published).length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Published Posts</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#b89123] flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.filter(u => u.role === 'admin').length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}