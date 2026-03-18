import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { base44 } from "@/api/base44Client";
import { Bike, Menu, X, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "./components/notifications/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.log("Not authenticated");
      }
    };
    fetchUser();
  }, []);

  const navLinks = [
    { name: "Home", page: "Home" },
    { 
      name: "Activities", 
      dropdown: [
        { name: "Events", page: "Events" },
        { name: "My Events", page: "MyEvents" },
        { name: "Routes", page: "Routes" },
        { name: "Leaderboard", page: "Leaderboard" },
        { name: "Challenges", page: "Challenges" },
        { name: "Team Challenges", page: "TeamChallengesPage" }
      ]
    },
    { 
      name: "Community", 
      dropdown: [
        { name: "Community", page: "Community" },
        { name: "Blog", page: "Blog" }
      ]
    },
    { name: "Gallery", page: "Gallery" },
    { name: "About", page: "About" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <style>{`
        :root {
          --cyblime-orange: #ff6b35;
          --cyblime-red: #ff4500;
          --cyblime-yellow: #ffa500;
        }

        /* Brick texture overlay */
        .brick-texture {
          background: 
            linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%),
            repeating-linear-gradient(0deg, #3d1f1f 0px, #3d1f1f 10px, #2d1616 10px, #2d1616 11px, #3d1f1f 11px, #3d1f1f 21px, #2d1616 21px, #2d1616 22px),
            repeating-linear-gradient(90deg, #3d1f1f 0px, #3d1f1f 20px, #2d1616 20px, #2d1616 22px);
        }
      `}</style>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b-4 border-orange-500" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%), repeating-linear-gradient(0deg, #3d1f1f 0px, #3d1f1f 10px, #2d1616 10px, #2d1616 11px, #3d1f1f 11px, #3d1f1f 21px, #2d1616 21px, #2d1616 22px), repeating-linear-gradient(90deg, #3d1f1f 0px, #3d1f1f 20px, #2d1616 20px, #2d1616 22px)',
        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)'
      }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69388a09dbcc4868114e26b8/14f671cc1_IMG_6951-removebg-preview.png" 
                alt="Cyblime Cycling Club" 
                className="h-12 w-auto"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <DropdownMenu key={link.name}>
                    <DropdownMenuTrigger className={`text-sm font-bold transition-colors uppercase tracking-wide flex items-center gap-1 ${
                      link.dropdown.some(item => item.page === currentPageName)
                        ? "text-[#ff6b35] drop-shadow-[0_0_8px_rgba(255,107,53,0.8)]"
                        : "text-[#ffa500] hover:text-[#ff6b35] hover:drop-shadow-[0_0_8px_rgba(255,107,53,0.6)]"
                    }`}>
                      {link.name}
                      <ChevronDown className="w-3 h-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-[#2d1616] border-orange-500/20">
                      {link.dropdown.map((item) => (
                        <DropdownMenuItem key={item.page} asChild>
                          <Link
                            to={createPageUrl(item.page)}
                            className={`cursor-pointer ${
                              currentPageName === item.page
                                ? "text-[#ff6b35] font-bold"
                                : "text-[#ffa500] hover:text-[#ff6b35]"
                            }`}
                          >
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    className={`text-sm font-bold transition-colors uppercase tracking-wide ${
                      currentPageName === link.page
                        ? "text-[#ff6b35] drop-shadow-[0_0_8px_rgba(255,107,53,0.8)]"
                        : "text-[#ffa500] hover:text-[#ff6b35] hover:drop-shadow-[0_0_8px_rgba(255,107,53,0.6)]"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <NotificationBell user={user} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="hidden sm:inline-flex text-sm font-bold uppercase tracking-wide text-[#ffa500] hover:text-[#ff6b35] hover:drop-shadow-[0_0_8px_rgba(255,107,53,0.6)]">
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Profile")} className="cursor-pointer">
                          <User className="w-4 h-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      {user?.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl("AdminDashboard")} className="cursor-pointer">
                              <Shield className="w-4 h-4 mr-2" />
                              Admin Portal
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => base44.auth.logout()}
                        className="cursor-pointer text-red-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link
                  to={createPageUrl("Login")}
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-bold uppercase tracking-wide bg-[#ff6b35] text-white rounded-lg hover:bg-[#ff8555] transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-orange-500" />
                ) : (
                  <Menu className="w-6 h-6 text-orange-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-4 border-orange-500" style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%), repeating-linear-gradient(0deg, #3d1f1f 0px, #3d1f1f 10px, #2d1616 10px, #2d1616 11px, #3d1f1f 11px, #3d1f1f 21px, #2d1616 21px, #2d1616 22px), repeating-linear-gradient(90deg, #3d1f1f 0px, #3d1f1f 20px, #2d1616 20px, #2d1616 22px)'
          }}>
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <div key={link.name}>
                    <div className="text-sm font-bold uppercase tracking-wide text-[#ffa500] mb-2">
                      {link.name}
                    </div>
                    <div className="pl-4 space-y-2">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.page}
                          to={createPageUrl(item.page)}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block py-2 text-base font-bold uppercase tracking-wide transition-colors ${
                            currentPageName === item.page
                              ? "text-[#ff6b35] drop-shadow-[0_0_8px_rgba(255,107,53,0.8)]"
                              : "text-[#ffa500] hover:text-[#ff6b35]"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-base font-bold uppercase tracking-wide transition-colors ${
                      currentPageName === link.page
                        ? "text-[#ff6b35] drop-shadow-[0_0_8px_rgba(255,107,53,0.8)]"
                        : "text-[#ffa500] hover:text-[#ff6b35]"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              {user ? (
                <>
                  <Link
                    to={createPageUrl("Profile")}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base font-bold uppercase tracking-wide text-[#ffa500] hover:text-[#ff6b35]"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => base44.auth.logout()}
                    className="block py-2 text-base font-bold uppercase tracking-wide text-red-500 hover:text-red-400 w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to={createPageUrl("Login")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-bold uppercase tracking-wide text-[#ff6b35] hover:text-[#ff8555]"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="pt-20 bg-[#0a0a0a]">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-12 bg-[#1a1a1a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69388a09dbcc4868114e26b8/156b8fca2_IMG_6951.png" 
                  alt="Cyblime Cycling Club" 
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-sm text-gray-400 max-w-sm">
                Ride together. Ride farther. Ride Cyblime.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  link.dropdown ? (
                    link.dropdown.map((item) => (
                      <li key={item.page}>
                        <Link
                          to={createPageUrl(item.page)}
                          className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li key={link.page}>
                      <Link
                        to={createPageUrl(link.page)}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  )
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Connect</h4>
              {/* TODO: Social media links should be configured via admin settings */}
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Strava</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Cyblime Cycling Club. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              {user?.role === 'admin' && (
                <Link to={createPageUrl("AdminDashboard")} className="text-sm text-[#ff6b35] hover:text-[#ff8555] transition-colors font-bold flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#ff6b35]/10 border border-[#ff6b35]/20">
                  <Shield className="w-4 h-4" />
                  Admin Portal
                </Link>
              )}
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}