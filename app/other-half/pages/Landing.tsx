import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users, BookOpen, Church, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, BIBLICAL_VERSES } from '../lib/constants';
import { useActionLoggerContext } from '../components/ActionLogger';

interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  verse?: string;
}

const features: FeatureCard[] = [
  {
    icon: Heart,
    title: 'Christ-Centered Relationships',
    description: 'Connect with fellow believers who share your faith and values, building relationships founded on biblical principles.',
    verse: 'Love is patient, love is kind. - 1 Corinthians 13:4'
  },
  {
    icon: Shield,
    title: 'Safe & Verified Community',
    description: 'Every profile is manually reviewed and verified to ensure a safe, authentic environment for Christian connections.',
    verse: 'Above all else, guard your heart. - Proverbs 4:23'
  },
  {
    icon: Users,
    title: 'Faithful Community',
    description: 'Join a community that celebrates faith, encourages growth, and supports your journey in love and life.',
    verse: 'Two are better than one. - Ecclesiastes 4:9'
  },
  {
    icon: BookOpen,
    title: 'Spiritual Growth',
    description: 'Access resources, discussions, and activities designed to strengthen your faith and relationships.',
    verse: 'Grow in the grace and knowledge of our Lord. - 2 Peter 3:18'
  }
];

const testimonials = [
  {
    name: 'Sarah & Michael',
    location: 'Austin, TX',
    story: 'We met through Other Half and bonded over our shared love for mission work. Six months later, we\'re planning our wedding!',
    rating: 5
  },
  {
    name: 'David',
    location: 'Denver, CO', 
    story: 'Finding genuine Christian friends was challenging until I discovered Other Half. The community here is truly special.',
    rating: 5
  },
  {
    name: 'Rebecca',
    location: 'Charlotte, NC',
    story: 'The verification process gave me confidence that everyone here is serious about their faith and intentions.',
    rating: 5
  }
];

export function Landing() {
  const [currentVerse, setCurrentVerse] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { logClick } = useActionLoggerContext();

  // Rotate biblical verses
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVerse((prev) => (prev + 1) % BIBLICAL_VERSES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Track mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    logClick('landing-get-started', 'button', {
      action: 'navigate_to_signup',
      source: 'hero_section'
    });
  };

  const handleLearnMore = () => {
    logClick('landing-learn-more', 'button', {
      action: 'scroll_to_features',
      source: 'hero_section'
    });
    
    document.getElementById('features')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleLogin = () => {
    logClick('landing-login', 'button', {
      action: 'navigate_to_login',
      source: 'header'
    });
  };

  return (
    <div className="min-h-screen bg-surface faith-background overflow-x-hidden">
      {/* Enhanced faith symbols with parallax */}
      <div className="faith-symbols">
        <div 
          className="faith-symbol cross-1"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        >
          ✝
        </div>
        <div 
          className="faith-symbol cross-2"
          style={{
            transform: `translate(${-mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`
          }}
        >
          ✝
        </div>
        <div 
          className="faith-symbol heart-1"
          style={{
            transform: `translate(${mousePosition.x * 0.08}px, ${-mousePosition.y * 0.08}px)`
          }}
        >
          💛
        </div>
        <div 
          className="faith-symbol heart-2"
          style={{
            transform: `translate(${-mousePosition.x * 0.12}px, ${mousePosition.y * 0.12}px)`
          }}
        >
          💛
        </div>
        <div 
          className="faith-symbol dove-1"
          style={{
            transform: `translate(${mousePosition.x * 0.06}px, ${-mousePosition.y * 0.06}px)`
          }}
        >
          🕊
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg divine-glow">
              <Heart className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Other Half</h1>
              <p className="text-sm text-neutral-600">Faith • Love • Community</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/login" 
              onClick={handleLogin}
              className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Button 
              asChild
              className="btn-primary"
            >
              <Link to={ROUTES.ONBOARDING} onClick={handleGetStarted}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
              Find Your
              <span className="text-primary-600 divine-glow"> Other Half</span>
            </h2>
            <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              Where faith meets love. Connect with fellow believers in a safe, 
              verified community built on biblical values and genuine connections.
            </p>
          </div>

          {/* Rotating biblical verse */}
          <div className="mb-12">
            <div className="bible-verse mx-auto max-w-lg transition-opacity duration-500">
              {BIBLICAL_VERSES[currentVerse]}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="btn-primary text-lg px-8 py-4"
              asChild
            >
              <Link to={ROUTES.ONBOARDING} onClick={handleGetStarted}>
                Start Your Journey
              </Link>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="btn-secondary text-lg px-8 py-4"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 md:px-6 lg:px-8 bg-surface-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Built on Faith, Designed for Love
            </h3>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Every feature of Other Half is thoughtfully designed to honor God 
              and help you build meaningful, lasting relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="faith-card blessed">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-neutral-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-neutral-600 mb-4">
                    {feature.description}
                  </CardDescription>
                  {feature.verse && (
                    <div className="text-sm italic text-primary-700 font-medium">
                      "{feature.verse}"
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Stories of Faith and Love
            </h3>
            <p className="text-lg text-neutral-600">
              Real stories from our community members
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="faith-card">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary-400 text-primary-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg font-semibold text-neutral-900">
                    {testimonial.name}
                  </CardTitle>
                  <CardDescription className="text-neutral-500">
                    {testimonial.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 italic">
                    "{testimonial.story}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:px-6 lg:px-8 bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-2 bg-primary-100 rounded-lg w-fit mx-auto mb-6 divine-glow">
            <Church className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
            Ready to Begin Your Journey?
          </h3>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Join thousands of Christians who have found meaningful connections, 
            lasting friendships, and life partners through Other Half.
          </p>
          
          <div className="bible-verse mb-8">
            "He who finds a wife finds what is good and receives favor from the Lord."
            <div className="text-sm text-neutral-500 mt-2">— Proverbs 18:22</div>
          </div>

          <Button 
            size="lg"
            className="btn-primary text-lg px-8 py-4"
            asChild
          >
            <Link to={ROUTES.ONBOARDING} onClick={handleGetStarted}>
              Join Other Half Today
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 md:px-6 lg:px-8 bg-neutral-900 text-neutral-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Other Half</h4>
                <p className="text-sm text-neutral-400">Faith • Love • Community</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          
          <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 Other Half. All rights reserved. Built with love and faith.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
