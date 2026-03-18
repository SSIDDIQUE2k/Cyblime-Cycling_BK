import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { usePageContent } from "../hooks/usePageContent";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ExternalLink,
  Users,
  MapPin,
  Trophy,
  Activity,
  TrendingUp,
  Calendar
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const STRAVA_CLUB_URL = "https://www.strava.com/clubs/762372";

const stats = [
  { label: "Active Members", value: "2,500+", icon: Users },
  { label: "Weekly Rides", value: "15+", icon: Calendar },
  { label: "Routes Mapped", value: "500+", icon: MapPin },
  { label: "Total Distance", value: "1M+ km", icon: TrendingUp }
];

const features = [
  {
    title: "Group Rides",
    description: "Join weekly group rides with riders of all levels. From easy social spins to fast-paced training rides.",
    icon: Activity
  },
  {
    title: "Challenges",
    description: "Compete in monthly challenges to push your limits and climb the leaderboard.",
    icon: Trophy
  },
  {
    title: "Route Discovery",
    description: "Access our curated collection of routes — from scenic weekend loops to epic all-day adventures.",
    icon: MapPin
  },
  {
    title: "Community",
    description: "Connect with passionate cyclists, share achievements, and find your riding partners.",
    icon: Users
  }
];

const DEFAULT_STRAVA_CONTENT = {
  hero: {
    heading: "Cyblime on Strava",
    subheading: "Track your rides, join group activities, compete in challenges, and connect with the Cyblime community — all through Strava."
  },
  stats: [
    { label: "Active Members", value: "2,500+", icon: "Users" },
    { label: "Weekly Rides", value: "15+", icon: "Calendar" },
    { label: "Routes Mapped", value: "500+", icon: "MapPin" },
    { label: "Total Distance", value: "1M+ km", icon: "TrendingUp" }
  ],
  club_url: "https://www.strava.com/clubs/762372",
  cta: {
    heading: "Ready to Ride?",
    subheading: "Join 2,500+ cyclists on Strava and become part of London's most active cycling community."
  }
};

export default function StravaClub() {
  const { content: pageContent } = usePageContent("strava", DEFAULT_STRAVA_CONTENT);

  return (
    <div className="min-h-screen bg-[var(--cy-bg)]">

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Strava orange gradient accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FC4C02]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              {/* Strava logo */}
              <svg className="w-8 h-8 text-[#FC4C02]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
              </svg>
              <span className="text-sm font-semibold text-[#FC4C02] uppercase tracking-widest">Strava Club</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--cy-text)] tracking-tight mb-6">
              {pageContent.hero.heading}
            </h1>
            <p className="text-xl text-[var(--cy-text-muted)] leading-relaxed max-w-2xl mb-10">
              {pageContent.hero.subheading}
            </p>

            <div className="flex flex-wrap gap-4">
              <a href={STRAVA_CLUB_URL} target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#FC4C02] hover:bg-[#e04400] text-white rounded-full px-8 py-6 text-base font-semibold shadow-xl shadow-[#FC4C02]/20 hover:shadow-[#FC4C02]/30 transition-all">
                  Join on Strava
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <Link to={createPageUrl("Events")}>
                <Button variant="outline" className="rounded-full px-8 py-6 text-base font-semibold border-[var(--cy-border-strong)] text-[var(--cy-text)] hover:bg-[var(--cy-hover)]">
                  View Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--cy-bg-section)] border-y border-[var(--cy-border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FC4C02]/10 border border-[#FC4C02]/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-[#FC4C02]" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-[var(--cy-text)] mb-1">{stat.value}</div>
                  <div className="text-sm text-[var(--cy-text-muted)]">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <p className="text-[#FC4C02] font-semibold text-sm uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--cy-text)]">
              Ride. Compete. Connect.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="bg-[var(--cy-bg-card)] rounded-2xl p-8 border border-[var(--cy-border)] hover:border-[#FC4C02]/30 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FC4C02]/10 border border-[#FC4C02]/20 flex items-center justify-center mb-6 group-hover:bg-[#FC4C02]/20 transition-colors">
                    <Icon className="w-7 h-7 text-[#FC4C02]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--cy-text)] mb-3">{feature.title}</h3>
                  <p className="text-[var(--cy-text-muted)] leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="py-24 bg-[var(--cy-bg-section)] border-y border-[var(--cy-border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <p className="text-[#FC4C02] font-semibold text-sm uppercase tracking-widest mb-3">Get Started</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--cy-text)]">
              Join in 3 Steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Create a Strava Account", desc: "Download the Strava app and sign up for free." },
              { step: "02", title: "Find Cyblime Club", desc: "Search for 'Cyblime' or use our direct link to find the club." },
              { step: "03", title: "Request to Join", desc: "Click 'Join' and you're in. Start tracking rides with the community." }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-5xl font-bold text-[#FC4C02]/20 mb-4">{item.step}</div>
                <h3 className="text-lg font-bold text-[var(--cy-text)] mb-2">{item.title}</h3>
                <p className="text-[var(--cy-text-muted)] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FC4C02]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <svg className="w-16 h-16 text-[#FC4C02] mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
            </svg>
            <h2 className="text-5xl md:text-7xl font-bold text-[var(--cy-text)] mb-6 leading-tight">
              {pageContent.cta?.heading || "Ready to Ride?"}
            </h2>
            <p className="text-lg text-[var(--cy-text-muted)] mb-12 max-w-xl mx-auto leading-relaxed">
              {pageContent.cta?.subheading || "Join 2,500+ cyclists on Strava and become part of London's most active cycling community."}
            </p>
            <a href={STRAVA_CLUB_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#FC4C02] hover:bg-[#e04400] text-white rounded-full px-10 py-6 text-lg font-semibold shadow-xl shadow-[#FC4C02]/20">
                Join Cyblime on Strava
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
