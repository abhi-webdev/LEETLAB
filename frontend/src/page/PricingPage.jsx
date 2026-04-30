import React from "react";
import { Check, Zap, Crown, Star } from "lucide-react";
import { Link } from "react-router-dom";

const PricingPage = () => {
  const plans = [
    {
      name: "Freemium",
      price: "0",
      description: "Perfect for beginners starting their coding journey.",
      features: [
        "100+ Coding Problems",
        "Community Sheets & Challenges",
        "Basic Platform Roadmaps",
        "1 Month AI Discussion Access",
        "Basic Progress Tracking",
      ],
      cta: "Get Started",
      icon: <Star className="w-6 h-6 text-gray-400" />,
      popular: false,
    },
    {
      name: "Pro",
      price: "1999",
      description: "Ideal for serious coders and job seekers.",
      features: [
        "500+ Coding Problems",
        "Premium Sheets & Challenges",
        "Personalized AI Learning Paths",
        "6 Months AI Discussion Access",
        "Advanced Analytics & Tracking",
        "Priority Support",
      ],
      cta: "Unlock Pro",
      icon: <Zap className="w-6 h-6 text-primary" />,
      popular: true,
      badge: "Most Popular",
    },
    {
      name: "Premium",
      price: "4999",
      description: "Ultimate access for elite tech enthusiasts.",
      features: [
        "Unlimited Coding Problems",
        "1:1 Mentorship Sessions",
        "Unlimited AI Discussion Access",
        "Lifetime Premium Sheets",
        "Advanced Career Guidance",
        "Everything in Pro Plan",
      ],
      cta: "Go Premium",
      icon: <Crown className="w-6 h-6 text-warning" />,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-base-content via-primary to-base-content bg-clip-text text-transparent">
          Invest in Your Future
        </h1>
        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
          Choose a plan that fits your goals. One-time payment for lifetime access to the best coding resources.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative flex flex-col p-8 rounded-3xl border border-base-content/10 bg-base-100 pricing-card-hover ${
              plan.popular ? "pricing-card-pro scale-105 z-10" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-content text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                {plan.badge}
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-base-content/5 rounded-2xl border border-base-content/10">
                {plan.icon}
              </div>
              <h3 className="text-2xl font-bold">{plan.name}</h3>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-base-content">₹{plan.price}</span>
                <span className="text-base-content/60 ml-2">/ lifetime</span>
              </div>
              <p className="text-base-content/70 text-sm mt-2">{plan.description}</p>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, fIndex) => (
                <div key={fIndex} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 p-0.5 bg-success/20 rounded-full">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-base-content/80">{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`btn btn-block rounded-xl font-bold py-4 h-auto transition-all duration-300 ${
                plan.popular
                  ? "btn-primary shadow-lg shadow-primary/20"
                  : "btn-outline border-base-content/20 hover:bg-base-content/5"
              }`}
            >
              {plan.cta}
            </button>
            
            <p className="text-center text-[10px] text-base-content/50 mt-4 uppercase tracking-widest font-medium">
              + GST Applicable
            </p>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-20 p-8 rounded-3xl border border-white/5 bg-white/[0.02] text-center">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div>
            <h4 className="font-semibold text-primary mb-2">Is it really lifetime access?</h4>
            <p className="text-gray-400 text-sm">Yes! One-time payment, forever yours. No recurring subscriptions or hidden fees.</p>
          </div>
          <div>
            <h4 className="font-semibold text-primary mb-2">Can I upgrade later?</h4>
            <p className="text-gray-400 text-sm">Absolutely. You can upgrade from Freemium to Pro or Premium at any time by just paying the difference.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
