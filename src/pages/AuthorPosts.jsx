import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Eye, ArrowRight, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function AuthorPosts() {
  const urlParams = new URLSearchParams(window.location.search);
  const authorEmail = urlParams.get('author');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['authorPosts', authorEmail],
    queryFn: async () => {
      if (!authorEmail) return [];
      return await base44.entities.BlogPost.filter({ 
        created_by: authorEmail, 
        published: true 
      }, '-created_date');
    },
    enabled: !!authorEmail
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-[#555555]">Loading author posts...</div>
      </div>
    );
  }

  if (!authorEmail || posts.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2A2A2A] mb-4">No posts found</h2>
          <Link to={createPageUrl("Blog")}>
            <Button className="bg-[#c9a227] hover:bg-[#b89123] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const authorName = authorEmail.split('@')[0];
  const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <Link to={createPageUrl("Blog")}>
            <Button variant="ghost" className="text-[#555555] hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Author Header */}
      <section className="bg-gradient-to-br from-[#2A2A2A] to-[#1a1a1a] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c9a227] to-[#b89123] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {authorName}
            </h1>
            <p className="text-lg text-gray-400 mb-8">{authorEmail}</p>
            
            <div className="flex items-center justify-center gap-8 text-white">
              <div>
                <div className="text-3xl font-bold text-[#A4FF4F]">{posts.length}</div>
                <div className="text-sm text-gray-400">Articles</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div>
                <div className="text-3xl font-bold text-[#A4FF4F]">{totalViews.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Views</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Author's Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#2A2A2A] mb-8">
            All Articles by {authorName}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.featured_image || "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <Badge className="bg-[#6BCBFF]/20 text-[#6BCBFF] border-0 mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-bold text-[#2A2A2A] mb-3">{post.title}</h3>
                  <p className="text-[#555555] mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-[#555555] mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.created_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{post.view_count || 0}</span>
                    </div>
                  </div>
                  <Link to={createPageUrl("BlogPost") + `?id=${post.id}`}>
                    <Button variant="ghost" className="w-full text-[#c9a227] hover:text-[#b89123]">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}