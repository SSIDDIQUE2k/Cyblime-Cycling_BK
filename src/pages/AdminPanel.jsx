import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Upload, X, Sparkles, CheckCircle, XCircle, Instagram } from "lucide-react";
import InstagramAdminSettings from "../components/instagram/InstagramAdminSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AIBlogGenerator } from "../components/ai/AIContentGenerator";
import { motion } from "framer-motion";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("blog");

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Content Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your blog posts, events, routes, and more</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/5 p-1">
            <TabsTrigger value="blog" className="data-[state=active]:bg-[#c9a227] data-[state=active]:text-white">Blog</TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-[#c9a227] data-[state=active]:text-white">Events</TabsTrigger>
            <TabsTrigger value="routes" className="data-[state=active]:bg-[#c9a227] data-[state=active]:text-white">Routes</TabsTrigger>
            <TabsTrigger value="strava" className="data-[state=active]:bg-[#c9a227] data-[state=active]:text-white">Strava</TabsTrigger>
            <TabsTrigger value="instagram" className="data-[state=active]:bg-[#c9a227] data-[state=active]:text-white">Instagram</TabsTrigger>
            <TabsTrigger value="moderation" className="data-[state=active]:bg-[#c9a227] data-[state=active]:text-white">Moderation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blog" className="mt-6">
            <BlogManagement />
          </TabsContent>
          
          <TabsContent value="events" className="mt-6">
            <EventManagement />
          </TabsContent>
          
          <TabsContent value="routes" className="mt-6">
            <RouteManagement />
          </TabsContent>
          
          <TabsContent value="strava" className="mt-6">
            <StravaManagement />
          </TabsContent>
          
          <TabsContent value="instagram" className="mt-6">
            <InstagramAdminSettings />
          </TabsContent>
          
          <TabsContent value="moderation" className="mt-6">
            <ModerationManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

// Blog Management Component
function BlogManagement() {
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    featured_image: "",
    category: "news",
    published: false,
    tags: []
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['adminBlogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BlogPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      setEditDialogOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BlogPost.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      setEditDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogPost.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      featured_image: "",
      category: "news",
      published: false,
      tags: []
    });
    setUploadedImages([]);
    setEditingPost(null);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData(post);
    setEditDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleImageUpload = async (e, type = 'content') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      if (type === 'featured') {
        setFormData({ ...formData, featured_image: file_url });
      } else {
        setUploadedImages([...uploadedImages, file_url]);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    setUploadingImage(false);
  };

  const insertImageIntoContent = (imageUrl) => {
    const imageHtml = `<img src="${imageUrl}" alt="Blog image" style="max-width: 100%; height: auto; margin: 20px 0;" />`;
    setFormData({ ...formData, content: formData.content + imageHtml });
  };

  const handleAIGenerate = (aiContent) => {
    setFormData({
      ...formData,
      title: aiContent.title,
      content: aiContent.content,
      excerpt: aiContent.excerpt,
      tags: aiContent.tags || []
    });
  };

  return (
    <div className="space-y-6">
      <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="dark:text-white">Blog Posts</CardTitle>
          <div className="flex gap-3">
            <Button
              onClick={() => setAiDialogOpen(true)}
              variant="outline"
              className="dark:bg-white/5 dark:border-white/10"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generate
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setEditDialogOpen(true);
              }}
              className="bg-[#c9a227] hover:bg-[#b89123] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                      <Badge className={post.published ? 'bg-green-500 text-white border-0' : 'bg-gray-400 text-white border-0'}>
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant="outline" className="dark:border-white/10 dark:text-gray-400">
                        {post.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                      <span>{post.view_count || 0} views</span>
                      <span>•</span>
                      <span>{new Date(post.created_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(post)} className="dark:bg-white/5 dark:border-white/10">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(post.id)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Create Post'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div>
              <Label>Featured Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'featured')}
                disabled={uploadingImage}
              />
              {formData.featured_image && (
                <img src={formData.featured_image} alt="Featured" className="mt-2 h-32 rounded-lg" />
              )}
            </div>

            <div>
              <Label>Excerpt</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows={2}
              />
            </div>

            <div>
              <Label>Content</Label>
              <ReactQuill
                value={formData.content}
                onChange={(content) => setFormData({...formData, content})}
                className="bg-white"
              />
            </div>

            <div>
              <Label>Upload Images for Content</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'content')}
                disabled={uploadingImage}
                multiple
              />
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {uploadedImages.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt={`Upload ${i}`} className="h-20 w-full object-cover rounded" />
                      <Button
                        size="sm"
                        onClick={() => insertImageIntoContent(url)}
                        className="mt-1 w-full text-xs"
                      >
                        Insert
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="tips">Tips</SelectItem>
                    <SelectItem value="stories">Stories</SelectItem>
                    <SelectItem value="gear">Gear</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Publish</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#c9a227] hover:bg-[#b89123] text-white">
                {editingPost ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AIBlogGenerator
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
}

// Event Management Component
function EventManagement() {
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "ride",
    date: "",
    time: "",
    location: "",
    level: "All Levels",
    distance: "",
    max_participants: 50,
    price: 0,
    status: "published"
  });

  const { data: events = [] } = useQuery({
    queryKey: ['adminEvents'],
    queryFn: () => base44.entities.Event.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Event.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      setEditDialogOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Event.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      setEditDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Event.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "ride",
      date: "",
      time: "",
      location: "",
      level: "All Levels",
      distance: "",
      max_participants: 50,
      price: 0,
      status: "published"
    });
    setEditingEvent(null);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setEditDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="dark:text-white">Events</CardTitle>
          <Button
            onClick={() => {
              resetForm();
              setEditDialogOpen(true);
            }}
            className="bg-[#c9a227] hover:bg-[#b89123] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                      <Badge className={event.status === 'published' ? 'bg-green-500 text-white border-0' : 'bg-gray-400 text-white border-0'}>
                        {event.status}
                      </Badge>
                      <Badge variant="outline" className="dark:border-white/10 dark:text-gray-400">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {event.date} • {event.location}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(event)} className="dark:bg-white/5 dark:border-white/10">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(event.id)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ride">Group Ride</SelectItem>
                    <SelectItem value="trip">Adventure Trip</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="social">Social Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Level</Label>
                <Select value={formData.level} onValueChange={(val) => setFormData({...formData, level: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="All Levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  placeholder="e.g., 7:00 AM - 10:00 AM"
                  required
                />
              </div>
              <div className="col-span-2">
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>Distance</Label>
                <Input
                  value={formData.distance}
                  onChange={(e) => setFormData({...formData, distance: e.target.value})}
                  placeholder="e.g., 30km"
                />
              </div>
              <div>
                <Label>Max Participants</Label>
                <Input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({...formData, max_participants: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#c9a227] hover:bg-[#b89123] text-white">
                {editingEvent ? 'Update' : 'Create'} Event
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Route Management Component
function RouteManagement() {
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    distance: "",
    elevation_gain: "",
    difficulty: "Moderate",
    surface_type: "Paved",
    start_location: "",
    end_location: "",
    map_image_url: "",
    video_url: "",
    gpx_file_url: "",
    estimated_time: "",
    highlights: [],
    content_images: [],
    is_public: true
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['adminRoutes'],
    queryFn: () => base44.entities.Route.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Route.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRoutes'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setEditDialogOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Route.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRoutes'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setEditDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Route.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRoutes'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      distance: "",
      elevation_gain: "",
      difficulty: "Moderate",
      surface_type: "Paved",
      start_location: "",
      end_location: "",
      map_image_url: "",
      video_url: "",
      gpx_file_url: "",
      estimated_time: "",
      highlights: [],
      content_images: [],
      is_public: true
    });
    setUploadedImages([]);
    setEditingRoute(null);
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData(route);
    setEditDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      distance: parseFloat(formData.distance),
      elevation_gain: parseFloat(formData.elevation_gain),
      estimated_time: parseFloat(formData.estimated_time),
      rating: 5.0,
      total_rides: 0
    };

    if (editingRoute) {
      updateMutation.mutate({ id: editingRoute.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleImageUpload = async (e, type = 'content') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      if (type === 'map') {
        setFormData({ ...formData, map_image_url: file_url });
      } else if (type === 'gpx') {
        setFormData({ ...formData, gpx_file_url: file_url });
      } else {
        setUploadedImages([...uploadedImages, file_url]);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    setUploadingImage(false);
  };

  const addImageToContent = (imageUrl, position, caption) => {
    const newImage = { url: imageUrl, position, caption };
    setFormData({
      ...formData,
      content_images: [...(formData.content_images || []), newImage]
    });
  };

  return (
    <div className="space-y-6">
      <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="dark:text-white">Routes</CardTitle>
          <Button
            onClick={() => {
              resetForm();
              setEditDialogOpen(true);
            }}
            className="bg-[#c9a227] hover:bg-[#b89123] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Route
          </Button>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {routes.map((route, index) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{route.name}</h3>
                      <Badge className="bg-[#c9a227] text-white border-0">{route.difficulty}</Badge>
                      <Badge variant="outline" className="dark:border-white/10 dark:text-gray-400">
                        {route.surface_type}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {route.distance}km • {route.elevation_gain}m elevation
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(route)} className="dark:bg-white/5 dark:border-white/10">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(route.id)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoute ? 'Edit Route' : 'Create Route'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Route Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="col-span-2">
                <Label>Map Image / Hero Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'map')}
                  disabled={uploadingImage}
                />
                {formData.map_image_url && (
                  <img src={formData.map_image_url} alt="Map" className="mt-2 h-32 rounded-lg" />
                )}
              </div>

              <div className="col-span-2">
                <Label>Video URL (Optional - takes priority over image)</Label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                  placeholder="YouTube or Vimeo embed URL"
                />
              </div>

              <div className="col-span-2">
                <Label>GPX File</Label>
                <Input
                  type="file"
                  accept=".gpx"
                  onChange={(e) => handleImageUpload(e, 'gpx')}
                  disabled={uploadingImage}
                />
              </div>

              <div>
                <Label>Distance (km)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => setFormData({...formData, distance: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label>Elevation Gain (m)</Label>
                <Input
                  type="number"
                  value={formData.elevation_gain}
                  onChange={(e) => setFormData({...formData, elevation_gain: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label>Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(val) => setFormData({...formData, difficulty: val})}>
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

              <div>
                <Label>Surface Type</Label>
                <Select value={formData.surface_type} onValueChange={(val) => setFormData({...formData, surface_type: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paved">Paved</SelectItem>
                    <SelectItem value="Gravel">Gravel</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                    <SelectItem value="Mountain Trail">Mountain Trail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Start Location</Label>
                <Input
                  value={formData.start_location}
                  onChange={(e) => setFormData({...formData, start_location: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label>End Location</Label>
                <Input
                  value={formData.end_location}
                  onChange={(e) => setFormData({...formData, end_location: e.target.value})}
                />
              </div>

              <div>
                <Label>Estimated Time (hours)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={formData.estimated_time}
                  onChange={(e) => setFormData({...formData, estimated_time: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#c9a227] hover:bg-[#b89123] text-white">
                {editingRoute ? 'Update' : 'Create'} Route
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Strava Management Component
function StravaManagement() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    enabled: true,
    placement: "dedicated_page",
    section_title: "Cycling Community",
    club_url: "https://www.strava.com/clubs/762372"
  });

  const { data: settings } = useQuery({
    queryKey: ['stravaSettings'],
    queryFn: async () => {
      const settings = await base44.entities.StravaSettings.list();
      return settings[0] || null;
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => {
      if (settings) {
        return base44.entities.StravaSettings.update(settings.id, data);
      } else {
        return base44.entities.StravaSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stravaSettings'] });
    }
  });

  React.useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5">
        <CardHeader>
          <CardTitle className="dark:text-white">Strava Integration Settings</CardTitle>
        </CardHeader>
      </Card>
      
      <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Enable Strava Feed</span>
          </label>
        </div>

        <div>
          <Label>Placement</Label>
          <Select value={formData.placement} onValueChange={(val) => setFormData({...formData, placement: val})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="routes_tab">Routes Page (Tab)</SelectItem>
              <SelectItem value="dedicated_page">Dedicated Page</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Section Title</Label>
          <Input
            value={formData.section_title}
            onChange={(e) => setFormData({...formData, section_title: e.target.value})}
          />
        </div>

        <div>
          <Label>Strava Club URL</Label>
          <Input
            value={formData.club_url}
            onChange={(e) => setFormData({...formData, club_url: e.target.value})}
            placeholder="https://www.strava.com/clubs/762372"
          />
        </div>

            <Button type="submit" className="bg-[#c9a227] hover:bg-[#b89123] text-white">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Moderation Component
function ModerationManagement() {
  const queryClient = useQueryClient();
  const [activeSubTab, setActiveSubTab] = useState("pending");

  const { data: reports = [] } = useQuery({
    queryKey: ['reports'],
    queryFn: () => base44.entities.Report.list('-created_date')
  });

  const updateReportMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Report.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    }
  });

  const pendingReports = reports.filter(r => r.status === 'pending');
  const reviewedReports = reports.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="dark:text-white">Content Moderation</CardTitle>
            <div className="flex gap-4">
              <Badge className="bg-red-500 text-white border-0">{pendingReports.length} Pending</Badge>
              <Badge className="bg-green-500 text-white border-0">{reviewedReports.length} Reviewed</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/5">
          <TabsTrigger value="pending" className="data-[state=active]:bg-[#c9a227] data-[state=active]:text-white">Pending ({pendingReports.length})</TabsTrigger>
          <TabsTrigger value="reviewed" className="data-[state=active]:bg-[#c9a227] data-[state=active]:text-white">Reviewed ({reviewedReports.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingReports.length === 0 ? (
            <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5">
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">All Clear!</h3>
                <p className="text-gray-600 dark:text-gray-400">No pending reports</p>
              </CardContent>
            </Card>
          ) : (
            pendingReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-0">{report.content_type}</Badge>
                          <Badge variant="outline" className="dark:border-white/10 dark:text-gray-400">{report.reason}</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Content ID: {report.content_id.substring(0, 12)}...</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateReportMutation.mutate({ id: report.id, status: 'resolved' })}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReportMutation.mutate({ id: report.id, status: 'dismissed' })}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Reported by: {report.created_by} • {new Date(report.created_date).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="reviewed" className="space-y-4 mt-6">
          {reviewedReports.length === 0 ? (
            <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5">
              <CardContent className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">No reviewed reports</p>
              </CardContent>
            </Card>
          ) : (
            reviewedReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="admin-card dark:bg-gray-800/50 dark:border-white/5 opacity-60">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="outline" className="dark:border-white/10 dark:text-gray-400">{report.content_type}</Badge>
                          <Badge variant="outline" className="dark:border-white/10 dark:text-gray-400">{report.reason}</Badge>
                          <Badge className={report.status === 'resolved' ? 'bg-green-500 text-white border-0' : 'bg-gray-400 text-white border-0'}>
                            {report.status}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Content ID: {report.content_id.substring(0, 12)}...</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}