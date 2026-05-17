import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Compass, Brain, CloudSun, Hotel, Sparkles, Shield, Globe2, Zap,
  Star, ArrowRight, CheckCircle2, MapPin, Plane, Users, ChevronRight,
  BarChart3, Calendar, CreditCard, Menu, X,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const features = [
  { icon: Brain, title: 'AI-Powered Planning', desc: 'Get intelligent itineraries crafted by advanced AI that understands your travel style and preferences.' },
  { icon: CloudSun, title: 'Weather-Aware', desc: 'Plans adapt to weather forecasts. Get alerts and automatic replanning for weather-impacted days.' },
  { icon: Hotel, title: 'Smart Hotel Picks', desc: 'Curated hotel recommendations with direct booking links, ratings, and price comparisons.' },
  { icon: Sparkles, title: 'Trip Optimization', desc: 'AI analyzes your itinerary for conflicts, suggests alternatives, and maximizes your experience.' },
  { icon: Shield, title: 'Budget Protection', desc: 'Real-time budget tracking, spending analytics, and smart alerts to keep you on track.' },
  { icon: Globe2, title: '120+ Destinations', desc: 'From Paris to Tokyo, our AI has deep knowledge of destinations worldwide.' },
];

const steps = [
  { num: '01', title: 'Tell Us Your Dream', desc: 'Share your destination, dates, budget, and interests.', icon: MapPin },
  { num: '02', title: 'AI Crafts Your Plan', desc: 'Our AI generates a personalized day-by-day itinerary.', icon: Brain },
  { num: '03', title: 'Refine & Book', desc: 'Review, customize, and book everything in one place.', icon: Calendar },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Travel Blogger', text: 'Voyageur planned a 2-week Japan trip that was absolutely perfect. The weather alerts saved us from a typhoon day!', rating: 5 },
  { name: 'Marcus Johnson', role: 'Business Traveler', text: 'The AI optimization saved me $400 on my Rome trip by suggesting better timing for activities. Incredible.', rating: 5 },
  { name: 'Priya Sharma', role: 'Family Traveler', text: 'Planning family trips used to be stressful. Voyageur handles everything from dietary needs to kid-friendly activities.', rating: 5 },
];

const pricing = [
  { name: 'Explorer', price: 'Free', desc: 'For casual travelers', features: ['3 trips per month', 'Basic AI planning', 'Weather alerts', 'Community support'], cta: 'Get Started', highlighted: false },
  { name: 'Voyager', price: '$12', desc: 'For frequent travelers', features: ['Unlimited trips', 'Advanced AI optimization', 'Hotel & activity booking', 'Priority support', 'Budget analytics', 'Trip health score'], cta: 'Start Free Trial', highlighted: true },
  { name: 'Enterprise', price: '$49', desc: 'For travel teams', features: ['Everything in Voyager', 'Team collaboration', 'Custom integrations', 'Dedicated account manager', 'API access', 'SSO & compliance'], cta: 'Contact Sales', highlighted: false },
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            {['Features', 'How it Works', 'Pricing', 'Testimonials'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{item}</a>
            ))}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted">Sign In</Link>
            <Link to="/register" className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25">Get Started</Link>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 text-foreground md:hidden">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="border-t border-border bg-background px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {['Features', 'How it Works', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">{item}</a>
              ))}
              <hr className="border-border" />
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">Sign In</Link>
              <Link to="/register" className="rounded-xl bg-brand-500 px-5 py-2.5 text-center text-sm font-semibold text-white">Get Started</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 gradient-mesh" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 md:px-6 md:pb-32 md:pt-32">
          <div className="flex flex-col items-center text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-400">
              <Sparkles className="h-4 w-4" /> AI-Powered Travel Planning
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mb-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Plan your travel
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-accent-400 to-brand-300 bg-clip-text text-transparent">with AI</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mb-10 max-w-2xl text-lg text-gray-300 md:text-xl">
              Voyageur creates personalized, weather-aware itineraries powered by AI. Plan smarter trips in minutes, not hours.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-col gap-4 sm:flex-row">
              <Link to="/register" className="group flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-2xl hover:shadow-brand-500/30">
                Start Planning Free <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#how-it-works" className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                How it Works
              </a>
            </motion.div>

            {/* Stats bar */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:grid-cols-4 md:gap-8 md:p-8">
              {[
                { icon: Plane, value: '50K+', label: 'Trips Planned' },
                { icon: Globe2, value: '120+', label: 'Countries' },
                { icon: Users, value: '30K+', label: 'Happy Travelers' },
                { icon: Star, value: '4.9', label: 'Average Rating' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2 text-center">
                  <s.icon className="h-5 w-5 text-brand-400" />
                  <span className="text-2xl font-bold text-white md:text-3xl">{s.value}</span>
                  <span className="text-xs text-gray-400 md:text-sm">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mb-16 text-center">
            <motion.p variants={fadeUp} custom={0} className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-500">Features</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">Everything you need to travel smarter</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mx-auto max-w-2xl text-lg text-muted-foreground">Powered by AI, designed for real travelers. Plan, optimize, and enjoy your trips like never before.</motion.p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand-500/30 hover:shadow-card-hover md:p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative bg-muted/30 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16 text-center">
            <motion.p variants={fadeUp} custom={0} className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-500">How it Works</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">Three steps to your perfect trip</motion.h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="relative text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand text-white shadow-lg shadow-brand-500/25">
                  <s.icon className="h-7 w-7" />
                </div>
                <span className="mb-2 block font-display text-sm font-bold text-brand-500">STEP {s.num}</span>
                <h3 className="mb-2 text-xl font-bold text-foreground">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
                {i < 2 && <ChevronRight className="absolute -right-4 top-8 hidden h-6 w-6 text-muted-foreground/30 md:block" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16 text-center">
            <motion.p variants={fadeUp} custom={0} className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-500">Testimonials</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-bold text-foreground md:text-4xl">Loved by travelers worldwide</motion.h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="mb-4 flex gap-1">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-accent-500 text-accent-500" />)}</div>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 font-semibold text-brand-500">{t.name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-muted/30 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16 text-center">
            <motion.p variants={fadeUp} custom={0} className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-500">Pricing</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">Simple, transparent pricing</motion.h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricing.map((p, i) => (
              <motion.div key={p.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className={cn('relative rounded-2xl border p-6 md:p-8', p.highlighted ? 'border-brand-500 bg-card shadow-xl shadow-brand-500/10' : 'border-border bg-card')}>
                {p.highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1 text-xs font-semibold text-white">Most Popular</div>}
                <h3 className="mb-1 text-lg font-bold text-foreground">{p.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mb-6"><span className="text-4xl font-bold text-foreground">{p.price}</span>{p.price !== 'Free' && <span className="text-muted-foreground">/mo</span>}</div>
                <ul className="mb-8 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success-500" />{f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={cn('block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all',
                  p.highlighted ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25' : 'border border-border text-foreground hover:bg-muted')}>
                  {p.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="mb-4 font-display text-3xl font-bold text-foreground md:text-5xl">Ready to travel smarter?</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mb-8 text-lg text-muted-foreground">Join thousands of travelers who plan better trips with Voyageur.</motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/register" className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-2xl">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Logo className="mb-4" />
              <p className="text-sm text-muted-foreground">AI-powered travel planning for the modern explorer.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'Licenses'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-sm font-semibold text-foreground">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Voyageur. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
