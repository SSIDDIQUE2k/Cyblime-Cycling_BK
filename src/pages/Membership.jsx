import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Sparkles,
  Crown,
  Users,
  ChevronRight,
  Calendar,
  MapPin,
  Trophy,
  Heart,
  Zap,
  Shield,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CONTACT_EMAIL = "info@cyblimecycling.com";

const ContactDialog = ({ isOpen, onClose, planName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#ff6b35]/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#ff6b35]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">
              Get Started with {planName}
            </h3>
            <p className="text-gray-600 mb-6">
              Contact us to get started with the <span className="font-semibold">{planName}</span> plan. We'll help you set everything up!
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Interested in ${planName} Membership&body=Hi, I'm interested in joining the ${planName} membership plan. Please send me more details.`}
              className="inline-flex items-center justify-center w-full bg-[#ff6b35] hover:bg-[#ff8555] text-white rounded-xl py-4 px-6 font-semibold transition-colors mb-3"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Us at {CONTACT_EMAIL}
            </a>
            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PricingCard = ({ plan, isPopular, index, onGetStarted }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 ${
        isPopular ? 'border-2 border-[#ff6b35] scale-105' : 'border border-gray-100'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-[#ff6b35] text-white border-0 px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#ff6b35]/10 flex items-center justify-center mx-auto mb-4">
          {plan.icon}
        </div>
        <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">{plan.name}</h3>
        <p className="text-gray-600 text-sm">{plan.description}</p>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-end justify-center gap-2 mb-2">
          <span className="text-5xl font-bold text-[#1a1a1a]">${plan.price}</span>
          <span className="text-gray-500 mb-2">/{plan.period}</span>
        </div>
        {plan.savings && (
          <div className="text-sm text-[#ff6b35] font-medium">Save ${plan.savings}/year</div>
        )}
      </div>

      <Button
        className={`w-full rounded-xl py-6 mb-8 ${
          isPopular
            ? 'bg-[#ff6b35] hover:bg-[#ff8555] text-white'
            : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white'
        }`}
        onClick={() => onGetStarted(plan.name)}
      >
        Get Started
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>

      <div className="space-y-4">
        <div className="text-sm font-semibold text-[#1a1a1a] mb-3">What's included:</div>
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="w-5 h-5 text-[#ff6b35] flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
            )}
            <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-[#ff6b35] flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

export default function Membership() {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleGetStarted = (planName) => {
    setSelectedPlan(planName);
    setContactDialogOpen(true);
  };

  const plans = [
    {
      name: "Starter",
      description: "Perfect for casual riders",
      price: 29,
      period: "month",
      icon: <Users className="w-7 h-7 text-[#1a1a1a]" />,
      features: [
        { text: "Access to weekly group rides", included: true },
        { text: "Community social events", included: true },
        { text: "Member-only newsletter", included: true },
        { text: "10% discount on partner shops", included: true },
        { text: "Priority event registration", included: false },
        { text: "Adventure trip access", included: false },
        { text: "Workshops & training sessions", included: false },
        { text: "Personalized coaching", included: false }
      ]
    },
    {
      name: "Pro Rider",
      description: "For serious enthusiasts",
      price: 49,
      period: "month",
      savings: 110,
      icon: <Sparkles className="w-7 h-7 text-[#1a1a1a]" />,
      features: [
        { text: "Access to weekly group rides", included: true },
        { text: "Community social events", included: true },
        { text: "Member-only newsletter", included: true },
        { text: "15% discount on partner shops", included: true },
        { text: "Priority event registration", included: true },
        { text: "Adventure trip access", included: true },
        { text: "Workshops & training sessions", included: true },
        { text: "Personalized coaching", included: false }
      ]
    },
    {
      name: "Elite",
      description: "Complete experience",
      price: 89,
      period: "month",
      savings: 228,
      icon: <Crown className="w-7 h-7 text-[#1a1a1a]" />,
      features: [
        { text: "Access to weekly group rides", included: true },
        { text: "Community social events", included: true },
        { text: "Member-only newsletter", included: true },
        { text: "20% discount on partner shops", included: true },
        { text: "Priority event registration", included: true },
        { text: "Adventure trip access", included: true },
        { text: "Workshops & training sessions", included: true },
        { text: "Personalized coaching", included: true }
      ]
    }
  ];

  const benefits = [
    {
      icon: Calendar,
      title: "150+ Annual Events",
      description: "From casual coffee rides to challenging multi-day adventures, there's always something happening."
    },
    {
      icon: MapPin,
      title: "Scenic Route Library",
      description: "Access our curated collection of the best cycling routes in the region, complete with difficulty ratings and highlights."
    },
    {
      icon: Trophy,
      title: "Skill Development",
      description: "Regular workshops on technique, nutrition, bike maintenance, and safety to help you become a better cyclist."
    },
    {
      icon: Heart,
      title: "Supportive Community",
      description: "Connect with fellow cyclists who share your passion, make lasting friendships, and ride with your crew."
    },
    {
      icon: Zap,
      title: "Expert Guidance",
      description: "Learn from experienced ride leaders and coaches who are dedicated to helping you reach your goals."
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "All rides include support vehicles, first aid, and comprehensive safety protocols for peace of mind."
    }
  ];

  const faqs = [
    {
      question: "Can I cancel my membership anytime?",
      answer: "Yes! You can cancel your membership at any time. Your access will continue until the end of your billing period."
    },
    {
      question: "What if I'm a complete beginner?",
      answer: "Perfect! We welcome cyclists of all levels. Our beginner-friendly rides and workshops are designed to help you build confidence and skills at your own pace."
    },
    {
      question: "Do I need expensive gear to join?",
      answer: "Not at all. A safe, road-worthy bike and a helmet are all you need to get started. We offer guidance on gear upgrades as you progress."
    },
    {
      question: "How many events can I attend per month?",
      answer: "As many as you'd like! Your membership gives you unlimited access to group rides and most events. Some premium adventure trips may have additional fees."
    },
    {
      question: "Is there a trial period?",
      answer: "Yes! We offer a 7-day money-back guarantee. If you're not satisfied within your first week, we'll refund your membership fee."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <ContactDialog
        isOpen={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        planName={selectedPlan}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#ff6b35]/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#ff6b35]/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
              Choose Your Ride
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of cyclists who are pushing their limits, building connections, and experiencing cycling at its finest.
            </p>

            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#ff6b35] mb-1">2,500+</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Active Members</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-4xl font-bold text-[#ff6b35] mb-1">4.9/5</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Member Rating</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-4xl font-bold text-[#ff6b35] mb-1">50K+</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Miles Ridden</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-block text-xs font-semibold tracking-widest text-[#ff6b35] uppercase mb-4">Membership Plans</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              Find Your Perfect Plan
            </h2>
            <p className="text-lg text-gray-600">
              Whether you're just starting out or ready for the full experience, we have a plan that fits your goals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard
                key={index}
                plan={plan}
                isPopular={index === 1}
                index={index}
                onGetStarted={handleGetStarted}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-gray-500">
              All plans include access to our community platform and member support
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-block text-xs font-semibold tracking-widest text-[#ff6b35] uppercase mb-4">Member Benefits</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              More Than Just Rides
            </h2>
            <p className="text-lg text-gray-600">
              Your membership unlocks a complete cycling ecosystem designed to support your journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <FeatureCard key={index} {...benefit} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-semibold tracking-widest text-[#ff6b35] uppercase mb-4">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              Common Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#ff6b35] to-[#ff8555]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Join the Pack?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Start your 7-day trial today. No commitment, cancel anytime.
            </p>
            <Button
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg"
              onClick={() => handleGetStarted("Free Trial")}
            >
              Start Free Trial
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-white/60 mt-4">
              Join 2,500+ riders who chose Cyblime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}