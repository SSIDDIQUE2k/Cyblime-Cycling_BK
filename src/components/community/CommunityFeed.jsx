import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import {
  MessageSquare,
  Heart,
  TrendingUp,
  ArrowRight,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FeedPost = ({ post, index }) => {
  const categoryColors = {
    general: "bg-gray-100 text-gray-800",
    routes: "bg-[#6BCBFF]/10 text-[#6BCBFF]",
    gear: "bg-[#A4FF4F]/10 text-[#A4FF4F]",
    training: "bg-[#ff6b35]/10 text-[#ff6b35]",
    maintenance: "bg-[#ffa500]/10 text-[#ffa500]",
    events: "bg-purple-100 text-purple-800"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <Badge className={`${categoryColors[post.category]} border-0 text-xs`}>
          {post.category}
        </Badge>
        <div className="flex items-center gap-2 text-xs text-[#555555]">
          <Calendar className="w-3 h-3" />
          <span>{new Date(post.created_date).toLocaleDateString()}</span>
        </div>
      </div>

      <h4 className="font-bold text-[#2A2A2A] mb-2 line-clamp-2">{post.title}</h4>
      <p className="text-sm text-[#555555] mb-4 line-clamp-2">{post.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-[#555555]">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{post.reply_count || 0} replies</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{post.view_count || 0} views</span>
          </div>
        </div>
        <Link 
          to={createPageUrl("Community")} 
          className="text-[#ff6b35] text-xs font-medium hover:underline"
        >
          Read more
        </Link>
      </div>
    </motion.div>
  );
};

export default function CommunityFeed() {
  const { data: posts = [] } = useQuery({
    queryKey: ['recentPosts'],
    queryFn: () => base44.entities.ForumPost.list('-created_date', 6)
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#2A2A2A] mb-2">Community Feed</h2>
            <p className="text-[#555555]">Latest discussions from our cycling community</p>
          </motion.div>
          <Link to={createPageUrl("Community")}>
            <Button variant="outline" className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <FeedPost key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-[#555555] mb-4">No posts yet. Be the first to share!</p>
            <Link to={createPageUrl("Community")}>
              <Button className="bg-[#ff6b35] hover:bg-[#ff4500] text-white">
                Start a Discussion
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}