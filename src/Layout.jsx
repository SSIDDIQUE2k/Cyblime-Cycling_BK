import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { base44 } from "@/api/base44Client";
import { useSiteSettings } from "./hooks/usePageContent";
import { Menu, X, User, LogOut, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "./components/notifications/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const { settings } = useSiteSettings({
    social_instagram: "",
    social_facebook: "",
    social_strava: "https://www.strava.com/clubs/762372",
    footer_text: "Ride together. Ride farther. Ride Cyblime.",
    contact_email: "info@cyblimecycling.com"
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        // Not authenticated — that's fine for public pages
      }
    };
    fetchUser();
  }, []);

  // Track scroll for navbar background transition
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5"
          : "bg-[#0a0a0a]/70 backdrop-blur-md"
      }`}>
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
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <DropdownMenu key={link.name}>
                    <DropdownMenuTrigger className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg flex items-center gap-1.5 ${
                      link.dropdown.some(item => item.page === currentPageName)
                        ? "text-[#ff6b35]"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}>
                      {link.name}
                      <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-[#141414] border-white/10 shadow-xl shadow-black/40 min-w-[180px]">
                      {link.dropdown.map((item) => (
                        <DropdownMenuItem key={item.page} asChild>
                          <Link
                            to={createPageUrl(item.page)}
                            className={`cursor-pointer px-3 py-2 ${
                              currentPageName === item.page
                                ? "text-[#ff6b35] font-medium"
                                : "text-gray-300 hover:text-white"
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
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                      currentPageName === link.page
                        ? "text-[#ff6b35]"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}

              {/* Membership CTA — stands out from regular nav */}
              <Link
                to={createPageUrl("Membership")}
                className={`ml-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  currentPageName === "Membership"
                    ? "bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/25"
                    : "bg-[#ff6b35]/10 text-[#ff6b35] border border-[#ff6b35]/30 hover:bg-[#ff6b35] hover:text-white hover:shadow-lg hover:shadow-[#ff6b35]/25"
                }`}
              >
                Join Us
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <NotificationBell user={user} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="hidden sm:inline-flex text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8555] flex items-center justify-center mr-2">
                          <span className="text-white text-xs font-bold">
                            {user.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        {user.full_name?.split(" ")[0] || "Profile"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-[#141414] border-white/10 shadow-xl shadow-black/40">
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Profile")} className="cursor-pointer text-gray-300 hover:text-white">
                          <User className="w-4 h-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      {user?.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl("AdminDashboard")} className="cursor-pointer text-[#ff6b35] hover:text-[#ff8555]">
                              <Shield className="w-4 h-4 mr-2" />
                              Admin Portal
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        onClick={() => base44.auth.logout()}
                        className="cursor-pointer text-red-400 hover:text-red-300"
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
                  className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold bg-white text-[#0a0a0a] rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0a0a]/98 backdrop-blur-xl">
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <div key={link.name} className="py-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-3 py-2">
                      {link.name}
                    </div>
                    <div className="space-y-0.5">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.page}
                          to={createPageUrl(item.page)}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            currentPageName === item.page
                              ? "text-[#ff6b35] bg-[#ff6b35]/10"
                              : "text-gray-300 hover:text-white hover:bg-white/5"
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
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      currentPageName === link.page
                        ? "text-[#ff6b35] bg-[#ff6b35]/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}

              {/* Mobile Membership CTA */}
              <Link
                to={createPageUrl("Membership")}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 mt-2 rounded-lg text-sm font-semibold text-center bg-[#ff6b35] text-white"
              >
                Join Us — Membership
              </Link>

              <div className="pt-3 mt-3 border-t border-white/5 space-y-0.5">
                {user ? (
                  <>
                    <Link
                      to={createPageUrl("Profile")}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8555] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {user.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      My Profile
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to={createPageUrl("AdminDashboard")}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#ff6b35] hover:bg-[#ff6b35]/10"
                      >
                        <Shield className="w-5 h-5" />
                        Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={() => base44.auth.logout()}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to={createPageUrl("Login")}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-center bg-white text-[#0a0a0a]"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="pt-20 bg-[#0a0a0a]">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-16 bg-[#0f0f0f] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69388a09dbcc4868114e26b8/156b8fca2_IMG_6951.png"
                  alt="Cyblime Cycling Club"
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                {settings.footer_text || "Ride together. Ride farther. Ride Cyblime."}
              </p>
              {/* Social icons row */}
              <div className="flex items-center gap-4 mt-6">
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#ff6b35]/20 flex items-center justify-center transition-colors group" aria-label="Instagram">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-[#ff6b35] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#ff6b35]/20 flex items-center justify-center transition-colors group" aria-label="Facebook">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-[#ff6b35] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {settings.social_strava && (
                  <a href={settings.social_strava} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#ff6b35]/20 flex items-center justify-center transition-colors group" aria-label="Strava">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-[#ff6b35] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/></svg>
                  </a>
                )}
                {settings.contact_email && (
                  <a href={`mailto:${settings.contact_email}`} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#ff6b35]/20 flex items-center justify-center transition-colors group" aria-label="Email">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-[#ff6b35] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  link.dropdown ? (
                    link.dropdown.map((item) => (
                      <li key={item.page}>
                        <Link
                          to={createPageUrl(item.page)}
                          className="text-sm text-gray-400 hover:text-[#ff6b35] transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li key={link.page}>
                      <Link
                        to={createPageUrl(link.page)}
                        className="text-sm text-gray-400 hover:text-[#ff6b35] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  )
                ))}
                <li>
                  <Link
                    to={createPageUrl("Membership")}
                    className="text-sm text-[#ff6b35] hover:text-[#ff8555] transition-colors font-medium"
                  >
                    Membership →
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
              <ul className="space-y-2.5">
                {settings.social_instagram && (
                  <li><a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-[#ff6b35] transition-colors">Instagram</a></li>
                )}
                {settings.social_facebook && (
                  <li><a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-[#ff6b35] transition-colors">Facebook</a></li>
                )}
                {settings.social_strava && (
                  <li><a href={settings.social_strava} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-[#ff6b35] transition-colors">Strava</a></li>
                )}
                {settings.contact_email && (
                  <li><a href={`mailto:${settings.contact_email}`} className="text-sm text-gray-400 hover:text-[#ff6b35] transition-colors">{settings.contact_email}</a></li>
                )}
                {!settings.social_instagram && !settings.social_facebook && !settings.social_strava && (
                  <>
                    <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6b35] transition-colors">Instagram</a></li>
                    <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6b35] transition-colors">Facebook</a></li>
                    <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6b35] transition-colors">Strava</a></li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Cyblime Cycling Club. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              {user?.role === 'admin' && (
                <Link to={createPageUrl("AdminDashboard")} className="text-sm text-[#ff6b35] hover:text-[#ff8555] transition-colors font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff6b35]/10 border border-[#ff6b35]/20 hover:border-[#ff6b35]/40">
                  <Shield className="w-3.5 h-3.5" />
                  Admin Portal
                </Link>
              )}
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
