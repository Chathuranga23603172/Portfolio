import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight, Mail, Sparkles, Terminal, Layers, Database, Phone, ExternalLink } from 'lucide-react';
import { GithubIcon as Github, LinkedinIcon as Linkedin } from './Icons';
import confetti from 'canvas-confetti';
import { personalInfo } from '../data/portfolioData';
import HeroParticleCanvas from './HeroParticleCanvas';

export default function Hero({ onOpenCv }) {
  const [photoSrc, setPhotoSrc] = useState(personalInfo.profilePhotoTransparent || '/profile_photo.png');

  const handleDownloadCv = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
    });

    const link = document.createElement('a');
    link.href = personalInfo.cvPdfUrl;
    link.download = 'Nirmal_Chathuranga_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      onOpenCv();
    }, 600);
  };

  return (
    <section id="hero" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 md:pt-40 md:pb-28 overflow-hidden">
      
      {/* === Background Layer 1: High-Fidelity Interactive 144Hz Particle Constellation Canvas === */}
      <HeroParticleCanvas />

      {/* === Background Layer 2: Dynamic Glowing Gradient Mesh Orbs (Continuous Drift) === */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] md:w-[600px] h-[280px] sm:h-[400px] bg-gradient-to-tr from-brand-violet/20 via-brand-cyan/20 to-transparent blur-[50px] sm:blur-[70px] pointer-events-none rounded-full animate-mesh-1" style={{ transform: 'translate3d(0,0,0)', WebkitTransform: 'translate3d(0,0,0)' }} />
      <div className="absolute -top-10 right-2 sm:right-10 w-56 sm:w-80 h-56 sm:h-80 bg-brand-purple/15 blur-[45px] sm:blur-[60px] pointer-events-none rounded-full animate-mesh-2" style={{ transform: 'translate3d(0,0,0)', WebkitTransform: 'translate3d(0,0,0)' }} />
      <div className="absolute bottom-6 left-2 sm:left-10 w-60 sm:w-96 h-60 sm:h-96 bg-brand-cyan/15 blur-[45px] sm:blur-[60px] pointer-events-none rounded-full animate-mesh-3" style={{ transform: 'translate3d(0,0,0)', WebkitTransform: 'translate3d(0,0,0)' }} />

      {/* Background Layer 3: Tech Grid Overlay Pattern (with -webkit-mask-image fallback) */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:32px_32px] pointer-events-none z-0" 
        style={{ 
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, #000 70%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, #000 70%, transparent 100%)' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Bio & Actions */}
          <motion.div
            initial={{ opacity: 0.01, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6"
          >
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-slate-300">
                SLIIT Undergraduate • {personalInfo.standing}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-brand-violet via-brand-purple to-brand-cyan bg-clip-text text-transparent">
                {personalInfo.name}
              </span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-300">
                Full-Stack &amp; Software Developer
              </span>
            </h1>

            {/* Bio from CV */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Information Technology undergraduate at <span className="text-white font-medium">SLIIT</span> with hands-on experience building scalable, end-to-end web applications using the <span className="text-brand-cyan font-medium">MERN stack</span>, <span className="text-brand-violet font-medium">Java</span>, and <span className="text-emerald-400 font-medium">Spring Boot</span>.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handleDownloadCv}
                className="group relative px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-violet to-brand-indigo shadow-lg shadow-brand-violet/25 hover:shadow-brand-violet/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                id="hero-download-cv-btn"
              >
                <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                <span>Download CV</span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-white/20 rounded-md">PDF</span>
              </button>

              <button
                onClick={onOpenCv}
                className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                id="hero-preview-cv-btn"
              >
                <span>Preview Resume</span>
                <ExternalLink className="w-4 h-4 text-brand-cyan" />
              </button>

              <a
                href="#projects"
                className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all flex items-center justify-center gap-1.5 group cursor-pointer w-full sm:w-auto"
                id="hero-explore-projects-btn"
              >
                <span>Academic Projects</span>
                <ArrowRight className="w-4 h-4 text-brand-cyan transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Quick Contact Links */}
            <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs font-mono text-slate-400">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-1.5 hover:text-brand-cyan transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-brand-cyan" />
                <span>{personalInfo.email}</span>
              </a>
              <span className="text-slate-600 hidden xs:inline">•</span>
              <a
                href={`tel:${personalInfo.phone}`}
                className="flex items-center gap-1.5 hover:text-brand-cyan transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-brand-cyan" />
                <span>{personalInfo.phone}</span>
              </a>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <a
                href={personalInfo.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>@{personalInfo.githubUsername}</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: 144Hz High-Fidelity Transparent Profile Avatar with Levitating Glow & Data Streams */}
          <motion.div
            initial={{ opacity: 0.01, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center items-center relative w-full select-none"
          >
            <div className="relative w-[320px] h-[370px] sm:w-[420px] sm:h-[450px] md:w-[480px] md:h-[480px] flex items-center justify-center max-w-full">
              
              {/* === 1. Concentric Circular Background Data Rings (Rotating & Pulsing with 144Hz Frequency) === */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-data-field">
                <svg className="w-full h-full max-w-[480px] max-h-[480px]" viewBox="0 0 500 500">
                  <defs>
                    <linearGradient id="ringGradCyanViolet" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="streamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
                      <stop offset="40%" stopColor="#06b6d4" stopOpacity="1" />
                      <stop offset="70%" stopColor="#a855f7" stopOpacity="1" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="streamGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
                    </linearGradient>
                    <filter id="neonGlowStream" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Outermost Data Dial Ring (Clockwise) */}
                  <g className="animate-spin-clock origin-center">
                    <circle cx="250" cy="250" r="230" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                    <circle cx="250" cy="250" r="230" fill="none" stroke="rgba(6, 182, 212, 0.35)" strokeWidth="1.5" strokeDasharray="6 14 2 24" />
                    {/* Radial Degree Marks */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <line
                        key={deg}
                        x1="250"
                        y1="16"
                        x2="250"
                        y2="24"
                        stroke="rgba(6, 182, 212, 0.6)"
                        strokeWidth="1.5"
                        transform={`rotate(${deg} 250 250)`}
                      />
                    ))}
                    {[15, 30, 60, 75, 105, 120, 150, 165, 195, 210, 240, 255, 285, 300, 330, 345].map((deg) => (
                      <line
                        key={deg}
                        x1="250"
                        y1="18"
                        x2="250"
                        y2="22"
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="1"
                        transform={`rotate(${deg} 250 250)`}
                      />
                    ))}
                  </g>

                  {/* Middle High-Frequency Radar Ring (Counter-Clockwise) */}
                  <g className="animate-spin-counter origin-center">
                    <circle cx="250" cy="250" r="195" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1" />
                    <circle cx="250" cy="250" r="195" fill="none" stroke="url(#ringGradCyanViolet)" strokeWidth="2" strokeDasharray="30 45 8 15" />
                    {/* Fine coordinate ticks */}
                    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => (
                      <circle
                        key={deg}
                        cx="250"
                        cy="55"
                        r="1.8"
                        fill="#06b6d4"
                        transform={`rotate(${deg} 250 250)`}
                      />
                    ))}
                  </g>

                  {/* Inner Fast Humming Core Ring (Fast Clockwise) */}
                  <g className="animate-spin-fast-clock origin-center">
                    <circle cx="250" cy="250" r="160" fill="none" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="1" strokeDasharray="4 8" />
                    <circle cx="250" cy="250" r="160" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="40 180" />
                  </g>
                </svg>
              </div>

              {/* === 2. Swirling Data Streams (Purple-Cyan Trail Framing the Card at 144Hz Flow) === */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <svg className="w-[115%] h-[115%] overflow-visible" viewBox="0 0 500 500">
                  {/* Primary 3D Tilted Elliptical Orbit: Cyan -> Purple Stream */}
                  <g transform="rotate(-28 250 250)">
                    <ellipse
                      cx="250"
                      cy="250"
                      rx="210"
                      ry="95"
                      fill="none"
                      stroke="url(#streamGrad1)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="180 320"
                      className="animate-stream-fast"
                      filter="url(#neonGlowStream)"
                      opacity="0.95"
                    />
                    <ellipse
                      cx="250"
                      cy="250"
                      rx="210"
                      ry="95"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      strokeDasharray="2 8 1 14 3 6 1 10"
                      className="animate-stream-fast"
                    />
                    <circle cx="460" cy="250" r="3.5" fill="#ffffff" filter="url(#neonGlowStream)" />
                    <circle cx="454" cy="254" r="2" fill="#06b6d4" />
                    <circle cx="40" cy="250" r="3" fill="#a855f7" filter="url(#neonGlowStream)" />
                  </g>

                  {/* Secondary Counter-Swirling Stream: Violet -> Cyan Particle Stream */}
                  <g transform="rotate(32 250 250)">
                    <ellipse
                      cx="250"
                      cy="250"
                      rx="200"
                      ry="85"
                      fill="none"
                      stroke="url(#streamGrad2)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="120 380"
                      className="animate-stream-reverse"
                      filter="url(#neonGlowStream)"
                      opacity="0.8"
                    />
                    <ellipse
                      cx="250"
                      cy="250"
                      rx="200"
                      ry="85"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="1.8"
                      strokeDasharray="3 12 1 6 2 10"
                      className="animate-stream-reverse"
                    />
                  </g>
                </svg>
              </div>

              {/* === 3. Floating Labels with 144Hz Edge Light Refresh Pulse === */}
              {/* Floating Badge 1: MERN Stack (Top-Left) */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 left-0 sm:top-1 sm:-left-3 px-3 sm:px-3.5 py-1.5 rounded-xl glass-card flex items-center gap-2 shadow-2xl border z-30 animate-edge-refresh cursor-default backdrop-blur-xl"
              >
                <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-mono font-bold text-white tracking-wide">MERN Stack</span>
              </motion.div>

              {/* Floating Badge 2: >_ Java & Spring (Right Side) */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute top-1/2 -right-2 sm:-right-6 -translate-y-1/2 px-3 sm:px-3.5 py-1.5 rounded-xl glass-card flex items-center gap-2 shadow-2xl border z-30 animate-edge-refresh cursor-default backdrop-blur-xl"
              >
                <Terminal className="w-4 h-4 text-brand-cyan shrink-0" />
                <span className="text-[11px] sm:text-xs font-mono font-bold text-white tracking-wide">&gt;_ Java &amp; Spring</span>
              </motion.div>

              {/* Floating Badge 3: MySQL & Mongo (Bottom-Left) */}
              <motion.div
                animate={{ x: [-4, 4, -4], y: [4, -4, 4] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
                className="absolute bottom-3 left-1 sm:bottom-4 sm:-left-2 px-3 sm:px-3.5 py-1.5 rounded-xl glass-card flex items-center gap-2 shadow-2xl border z-30 animate-edge-refresh cursor-default backdrop-blur-xl"
              >
                <Database className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-mono font-bold text-white tracking-wide">MySQL &amp; Mongo</span>
              </motion.div>

              {/* === 4. Continuous Levitating Transparent Profile Picture with Synchronized Pulsating Glow === */}
              <motion.div
                animate={{
                  y: [-12, 10, -12],
                  filter: [
                    'drop-shadow(0 15px 25px rgba(6, 182, 212, 0.4)) drop-shadow(0 25px 45px rgba(139, 92, 246, 0.3))',
                    'drop-shadow(0 26px 42px rgba(6, 182, 212, 0.75)) drop-shadow(0 38px 75px rgba(168, 85, 247, 0.55))',
                    'drop-shadow(0 15px 25px rgba(6, 182, 212, 0.4)) drop-shadow(0 25px 45px rgba(139, 92, 246, 0.3))',
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-20 flex flex-col items-center justify-center"
              >
                {/* Levitating Portrait Container with Glow Backlight */}
                <div className="relative group flex items-center justify-center">
                  
                  {/* Soft ambient pulsating radial aura centered behind portrait silhouette */}
                  <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-brand-violet/30 via-brand-cyan/25 to-brand-purple/20 blur-3xl opacity-75 pointer-events-none animate-pulse-glow" />

                  {/* Profile Picture with Transparent Background Support */}
                  <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
                    <img
                      src={photoSrc}
                      alt={personalInfo.name}
                      className="w-full h-full object-contain select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
                      onError={() => {
                        if (photoSrc !== personalInfo.profilePhoto) {
                          setPhotoSrc(personalInfo.profilePhoto);
                        }
                      }}
                    />

                    {/* Live Status Beacon */}
                    <span className="absolute bottom-2 right-4 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-dark-950 shadow-md"></span>
                    </span>
                  </div>
                </div>

                {/* === 5. Holographic Pedestal Card beneath the levitating silhouette === */}
                <div className="relative mt-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl glass-card border border-white/[0.12] bg-dark-900/85 backdrop-blur-2xl shadow-2xl shadow-brand-violet/30 flex flex-col items-center text-center overflow-hidden">
                  
                  {/* Kinetic Specular Reflection Trail on the Pedestal */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-30">
                    <div className="w-24 h-[200%] -top-1/2 bg-gradient-to-r from-transparent via-white/20 via-cyan-300/25 to-transparent absolute animate-card-reflection" />
                  </div>

                  <div className="text-sm sm:text-base font-bold text-white tracking-wide z-10">
                    {personalInfo.name}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-slate-300 flex items-center justify-center gap-1 mt-0.5 z-10">
                    <Sparkles className="w-3 h-3 text-brand-cyan" />
                    <span>{personalInfo.title}</span>
                  </div>
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9px] sm:text-[10px] font-mono text-brand-cyan z-10">
                    SLIIT • {personalInfo.standing}
                  </div>
                </div>

              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* Quick Stats Strip */}
        <motion.div
          initial={{ opacity: 0.01, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/[0.06] grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          {personalInfo.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-brand-violet/30 transition-all text-center sm:text-left"
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
