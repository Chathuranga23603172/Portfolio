"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Star, MessageSquare, Send, 
  CheckCircle2, Clock, AlertCircle, 
  ShieldCheck, Flame, Mail, Wifi
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { 
  formatReviewTimestamp, 
  getInitials, 
  parseReviewDoc, 
  subscribeToLikes, 
  incrementLikes 
} from '../services/reviewService';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  
  // Real-time synchronization state
  const [liveStatus, setLiveStatus] = useState('connecting'); // connecting | connected | unconfigured | error
  const [syncError, setSyncError] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  
  // UI States
  const [formStatus, setFormStatus] = useState('idle'); // idle | submitting | success | error
  const [formError, setFormError] = useState('');
  const [filterRating, setFilterRating] = useState('all'); // all | 5 | verified

  // 1. True Real-Time Listener inside useEffect
  useEffect(() => {
    let unsubscribeReviews = () => {};

    if (db && isFirebaseConfigured) {
      try {
        // Query ALL reviews ordered by createdAt descending (global visibility, no user ID filtering)
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, orderBy('createdAt', 'desc'));

        // Real-Time onSnapshot listener: updates live across all connected clients without reload
        unsubscribeReviews = onSnapshot(
          q,
          (snapshot) => {
            const liveReviews = snapshot.docs.map(parseReviewDoc);
            setReviews(liveReviews);
            setLiveStatus('connected');
            setSyncError(null);
          },
          (error) => {
            console.error('Live Firestore onSnapshot listener error:', error);
            setLiveStatus('error');
            setSyncError(error.message);
          }
        );
      } catch (err) {
        console.error('Error creating live Firestore query:', err);
        setLiveStatus('error');
        setSyncError(err.message);
      }
    } else {
      // Fallback when Firebase credentials are not in .env
      setLiveStatus('unconfigured');
      const local = JSON.parse(localStorage.getItem('portfolio_real_reviews') || '[]');
      setReviews(local);

      const handleStorageUpdate = () => {
        const updated = JSON.parse(localStorage.getItem('portfolio_real_reviews') || '[]');
        setReviews(updated);
      };
      window.addEventListener('storage', handleStorageUpdate);
      window.addEventListener('portfolio-review-added', handleStorageUpdate);
      unsubscribeReviews = () => {
        window.removeEventListener('storage', handleStorageUpdate);
        window.removeEventListener('portfolio-review-added', handleStorageUpdate);
      };
    }

    // Subscribe to live likes
    const unsubscribeLikes = subscribeToLikes((count) => {
      setLikes(count);
    });

    const storedLiked = localStorage.getItem('portfolio_user_has_liked') === 'true';
    setHasLiked(storedLiked);

    return () => {
      if (typeof unsubscribeReviews === 'function') unsubscribeReviews();
      if (typeof unsubscribeLikes === 'function') unsubscribeLikes();
    };
  }, []);

  // Handle Heart Like Button click
  const handleLike = async () => {
    if (hasLiked) return;
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('portfolio_user_has_liked') === 'true') {
        setHasLiked(true);
        return;
      }
    } catch {
      // Continue if localStorage blocked
    }

    try {
      localStorage.setItem('portfolio_user_has_liked', 'true');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setHasLiked(true);

    // Floating heart particle animation
    const heartId = Date.now() + Math.random();
    setFloatingHearts((prev) => [...prev, { id: heartId, x: (Math.random() - 0.5) * 40 }]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
    }, 1200);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ec4899', '#f43f5e', '#8b5cf6', '#06b6d4'],
    });

    try {
      await incrementLikes();
    } catch (err) {
      console.error('Failed to increment likes:', err);
    }
  };

  // 4. Form Submission: Saves Name, Email, Message, Rating, and Server Timestamp
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (name.trim().length < 2) {
      setFormError('Name must be at least 2 characters.');
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFormError('Please enter a valid email address (e.g. yourname@example.com).');
      return;
    }
    if (!message.trim()) {
      setFormError('Please write a short message or recommendation.');
      return;
    }
    if (message.trim().length < 8) {
      setFormError('Message must be at least 8 characters long.');
      return;
    }

    setFormStatus('submitting');

    try {
      const trimmedName = name.trim();
      const trimmedRole = role.trim() || 'Visitor / Tech Peer';
      const trimmedMessage = message.trim();
      const numRating = Number(rating) || 5;

      const gradientColors = [
        'from-brand-violet to-brand-cyan',
        'from-emerald-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-amber-500 to-rose-500',
        'from-blue-500 to-teal-400',
      ];
      const avatarColor = gradientColors[Math.floor(Math.random() * gradientColors.length)];
      const initials = getInitials(trimmedName);

      if (db && isFirebaseConfigured) {
        // Direct live submission to Firestore with serverTimestamp()
        await addDoc(collection(db, 'reviews'), {
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          rating: numRating,
          role: trimmedRole,
          createdAt: serverTimestamp(),
          avatarColor,
          initials,
          verified: false,
        });
      } else {
        // Local device fallback if Firebase keys have not yet been provided in .env
        const newReview = {
          id: `review-${Date.now()}`,
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          rating: numRating,
          role: trimmedRole,
          formattedDate: formatReviewTimestamp(new Date()),
          timestampMs: Date.now(),
          avatarColor,
          initials,
          verified: false,
        };
        const existing = JSON.parse(localStorage.getItem('portfolio_real_reviews') || '[]');
        localStorage.setItem('portfolio_real_reviews', JSON.stringify([newReview, ...existing]));
        window.dispatchEvent(new CustomEvent('portfolio-review-added'));
      }

      setFormStatus('success');
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
      });

      // Clear form
      setName('');
      setEmail('');
      setRole('');
      setRating(5);
      setMessage('');

      setTimeout(() => {
        setFormStatus('idle');
      }, 4000);
    } catch (err) {
      console.error('Error submitting review:', err);
      setFormStatus('error');
      setFormError(err.message || 'Failed to post review. Please check your connection.');
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((rev) => {
    if (filterRating === '5') return rev.rating === 5;
    if (filterRating === 'verified') return rev.verified === true;
    return true;
  });

  // Calculate rating stats
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : '0.0';

  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const recommendationRate = reviews.length > 0
    ? Math.round((fiveStarCount / reviews.length) * 100)
    : 0;

  const ratingDescriptions = {
    1: 'Needs Improvement',
    2: 'Fair Experience',
    3: 'Good Quality',
    4: 'Very Impressive!',
    5: 'Exceptional & Top-Tier! ★',
  };

  return (
    <section id="reviews" className="py-16 sm:py-20 md:py-28 relative overflow-hidden">
      
      {/* Background ambient glow orbs */}
      <div className="absolute top-1/3 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-rose-500/10 blur-[110px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-brand-violet/10 blur-[110px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono mb-3 sm:mb-4">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            <span>COMMUNITY &amp; TESTIMONIALS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Likes &amp; Reviews
          </h2>
          <p className="mt-3 text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
            Leave a message in my public guestbook, rate your experience exploring my portfolio, or click the heart below to drop a quick like!
          </p>

          {/* Real-time Cloud Synced Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-900/80 border border-white/[0.08] text-[11px] font-mono text-slate-400 shadow-sm">
            {liveStatus === 'connected' ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-semibold">
                  Live Real-Time Synced (onSnapshot Active)
                </span>
              </>
            ) : liveStatus === 'error' ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-rose-400">Database Connection Issue: Check Rules</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-amber-300">Local Device Mode (Firebase Keys Needed in .env)</span>
              </>
            )}
          </div>

          {/* Setup / Status alerts */}
          {liveStatus === 'unconfigured' && (
            <div className="mt-3 max-w-xl mx-auto p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300 text-left flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-200">Global Sync Setup Guide:</p>
                <p className="mt-0.5 text-slate-300">
                  To sync reviews live across all devices worldwide like Facebook comments, add your Firebase keys in <code className="px-1 py-0.5 rounded bg-dark-950/80 text-amber-200">.env</code> (<code className="text-slate-300">VITE_FIREBASE_API_KEY</code>, <code className="text-slate-300">VITE_FIREBASE_PROJECT_ID</code>, etc.).
                </p>
              </div>
            </div>
          )}

          {liveStatus === 'error' && syncError && (
            <div className="mt-3 max-w-xl mx-auto p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono text-rose-300 text-left flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Firebase Firestore Notice:</p>
                <p className="mt-0.5 text-slate-300">
                  {syncError.includes('permission') || syncError.includes('rules') ? (
                    <span>Make sure Firestore Security Rules allow read/write in Firebase Console: <code className="px-1 py-0.5 rounded bg-dark-950 text-rose-200">allow read, write: if true;</code></span>
                  ) : (
                    <span>{syncError}</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Top Highlight Strip: Interactive Like Button & Aggregate Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 mb-12">
          
          {/* Card 1: Interactive Global Like Button */}
          <div className="md:col-span-6 lg:col-span-5 glass-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/[0.08] flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Global Portfolio Appreciation
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Enjoying My Work?
                </h3>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Flame className="w-5 h-5 text-rose-400" />
              </div>
            </div>

            <p className="text-xs text-slate-400 my-4 leading-relaxed">
              Every like increments our live counter across all visitor sessions. Show your support with one click!
            </p>

            <div className="flex items-center gap-4 pt-2">
              {/* Interactive Heart Button with Floating Hearts */}
              <div className="relative">
                <motion.button
                  type="button"
                  disabled={hasLiked}
                  whileHover={!hasLiked ? { scale: 1.05 } : undefined}
                  whileTap={!hasLiked ? { scale: 0.92 } : undefined}
                  onClick={handleLike}
                  className={`px-5 sm:px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-lg select-none ${
                    hasLiked
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/30 cursor-default pointer-events-none opacity-95'
                      : 'bg-white/[0.06] hover:bg-rose-500/20 border border-white/[0.1] hover:border-rose-500/40 text-rose-300 cursor-pointer'
                  }`}
                  id="portfolio-like-btn"
                  aria-label={hasLiked ? 'You have already liked this portfolio' : 'Like this portfolio'}
                  aria-disabled={hasLiked}
                >
                  <Heart
                    className={`w-4 h-4 transition-transform ${
                      hasLiked
                        ? 'fill-white text-white drop-shadow-sm'
                        : 'text-rose-400 group-hover:scale-110'
                    }`}
                  />
                  <span>{hasLiked ? 'Liked!' : 'Drop a Like'}</span>
                  {hasLiked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/90" />
                  )}
                </motion.button>

                {/* Floating Heart Particles */}
                <AnimatePresence>
                  {floatingHearts.map((heart) => (
                    <motion.div
                      key={heart.id}
                      initial={{ opacity: 1, y: 0, x: heart.x, scale: 0.8 }}
                      animate={{ opacity: 0, y: -70, scale: 1.4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.1, ease: 'easeOut' }}
                      className="absolute top-0 left-1/2 pointer-events-none text-rose-400 z-30"
                    >
                      <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Total Likes Counter */}
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {likes.toLocaleString()}
                </span>
                <span className="text-xs text-rose-400 font-semibold uppercase">
                  Total Likes
                </span>
              </div>
            </div>

            {/* Helper status text when user has already liked */}
            {hasLiked && (
              <p className="text-[11px] text-rose-300/85 font-mono mt-3 flex items-center gap-1.5 pt-2 border-t border-white/[0.06]">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>You&apos;ve already liked this portfolio. Thank you for your support!</span>
              </p>
            )}
          </div>

          {/* Card 2: Rating Metrics & Recommendation Rate */}
          <div className="md:col-span-6 lg:col-span-7 glass-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/[0.08] flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Peer &amp; Recruiter Ratings
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono flex items-center gap-1.5">
                    <span>{averageRating}</span>
                    <Star className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-400 text-amber-400 inline" />
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="text-white font-semibold block">{reviews.length} Total Reviews</span>
                    <span className="text-emerald-400 font-mono">
                      {reviews.length > 0 ? `${recommendationRate}% 5-Star Endorsements` : 'Be the first reviewer'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SLIIT Computing Guarantee */}
              <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-slate-300 flex items-center gap-1.5 self-start">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Verified Peer Reviews</span>
              </div>
            </div>

            {/* Rating breakdown bars */}
            <div className="space-y-1.5 mt-4 pt-3 border-t border-white/[0.06]">
              {[5, 4, 3].map((starNum) => {
                const count = reviews.filter((r) => r.rating === starNum).length;
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : starNum === 5 ? 100 : 0;
                return (
                  <div key={starNum} className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="w-12 text-[11px]">{starNum} Stars</span>
                    <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[11px] text-slate-300">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Main Content Area: Submission Form + Reviews Masonry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          
          {/* Left Column: Submit a Review Form */}
          <div className="lg:col-span-5 glass-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/[0.08] relative">
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-cyan" />
                <span>Leave a Review</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/10 text-brand-cyan border border-brand-violet/20 flex items-center gap-1">
                <Wifi className="w-3 h-3 text-brand-cyan" />
                <span>Live Feed</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Shared an academic module with me at SLIIT, collaborated on a project, or reviewing my portfolio? Your feedback is broadcast live to all visitors!
            </p>

            {formStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white">Review Broadcasted Live!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Thank you! Your testimonial is now live in real-time across all visitor screens.
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  Write Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4" noValidate>
                
                {/* Form Error Alert */}
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5" htmlFor="review-name">
                    YOUR NAME <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="review-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={50}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950/80 border border-white/[0.1] focus:border-brand-violet text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Email Address Field */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5" htmlFor="review-email">
                    YOUR EMAIL ADDRESS <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      id="review-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@example.com"
                      maxLength={80}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-dark-950/80 border border-white/[0.1] focus:border-brand-violet text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    Saved to database (kept confidential, never displayed publicly).
                  </span>
                </div>

                {/* Role / Organization Field */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5" htmlFor="review-role">
                    ROLE OR RELATIONSHIP <span className="text-slate-500 text-[10px]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="review-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Software Engineer / Peer / Recruiter"
                    maxLength={60}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950/80 border border-white/[0.1] focus:border-brand-violet text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Interactive Star Rating Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-mono text-slate-400 uppercase">
                      STAR RATING <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-amber-400 font-semibold">
                      {ratingDescriptions[hoverRating || rating]}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-dark-950/80 border border-white/[0.1]">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isActive = (hoverRating || rating) >= starValue;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 rounded-lg transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              isActive
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                                : 'text-slate-600 hover:text-slate-400'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-mono text-slate-400 uppercase" htmlFor="review-message">
                      MESSAGE OR RECOMMENDATION <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      {message.length} / 500
                    </span>
                  </div>
                  <textarea
                    id="review-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    placeholder="Share your thoughts on Nirmal's technical skills, teamwork on SLIIT deliverables, or website design..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950/80 border border-white/[0.1] focus:border-brand-violet text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-violet to-brand-cyan hover:opacity-95 shadow-lg shadow-brand-violet/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  id="submit-review-btn"
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Broadcasting to Feed...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Post Review to Guestbook</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-500 font-mono">
                  All reviews update instantly in real-time for all active visitors.
                </p>
              </form>
            )}

          </div>

          {/* Right Column: Reviews List with Filter Tabs */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setFilterRating('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                    filterRating === 'all'
                      ? 'bg-brand-violet text-white shadow-md shadow-brand-violet/30'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  All ({reviews.length})
                </button>
                <button
                  onClick={() => setFilterRating('5')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    filterRating === '5'
                      ? 'bg-amber-500 text-dark-950 font-bold shadow-md shadow-amber-500/30'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>5 Stars ({fiveStarCount})</span>
                </button>
                <button
                  onClick={() => setFilterRating('verified')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    filterRating === 'verified'
                      ? 'bg-brand-cyan text-dark-950 font-bold shadow-md shadow-brand-cyan/30'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Mentors &amp; Peers</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Global Feed • Latest First</span>
              </div>
            </div>

            {/* Reviews Cards List */}
            <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
              <AnimatePresence>
                {filteredReviews.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-10 sm:p-14 rounded-2xl sm:rounded-3xl border border-white/[0.08] text-center flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-cyan shadow-inner mb-1">
                      <MessageSquare className="w-7 h-7 text-brand-cyan" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white">
                      No reviews yet. Be the first to leave one!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                      Share your thoughts on working with Nirmal, project feedback, or a recommendation in the guestbook form on the left.
                    </p>
                  </motion.div>
                ) : (
                  filteredReviews.map((rev, idx) => (
                    <motion.div
                      key={rev.id || idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/[0.08] relative group hover:border-brand-violet/40 transition-all shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        
                        {/* Reviewer Info */}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${rev.avatarColor || 'from-brand-violet to-brand-cyan'} flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md shrink-0`}>
                            {rev.initials || 'NC'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-cyan transition-colors">
                                {rev.name}
                              </h4>
                              {rev.verified && (
                                <span className="p-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan" title="Verified Colleague or Mentor">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 block">
                              {rev.role}
                            </span>
                          </div>
                        </div>

                        {/* Stars Rating & Exact Timestamp */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((starIdx) => (
                              <Star
                                key={starIdx}
                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                  starIdx <= rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-600'
                                }`}
                              />
                            ))}
                          </div>

                          {/* Real-time Formatted Timestamp: e.g. "Oct 5, 2026 at 4:06 PM" */}
                          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-slate-400">
                            <Clock className="w-3 h-3 text-brand-cyan shrink-0" />
                            <span>{rev.formattedDate}</span>
                          </div>
                        </div>

                      </div>

                      {/* Review Message */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 border-t border-white/[0.04]">
                        "{rev.message}"
                      </p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
