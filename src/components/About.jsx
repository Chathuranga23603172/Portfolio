import React from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Cpu, Globe, CheckCircle2, Sparkles, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function About() {
  const pillars = [
    {
      icon: Code,
      title: 'Full-Stack MERN Architecture',
      desc: 'Developing end-to-end web applications using MongoDB, Express.js, React, and Node.js with secure authentication and state management.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Server,
      title: 'Java & Spring Boot Backends',
      desc: 'Applying robust Object-Oriented principles, multi-tier architectures, and clean database integrations for scalable performance.',
      color: 'from-brand-violet to-indigo-600',
    },
    {
      icon: Cpu,
      title: 'Relational & NoSQL Databases',
      desc: 'Designing and optimizing schemas with MySQL (PhpMyAdmin) and MongoDB, ensuring transactional integrity and fast querying.',
      color: 'from-brand-cyan to-blue-600',
    },
    {
      icon: Globe,
      title: 'Agile Team Collaboration',
      desc: 'Experienced in translating complex business requirements into maintainable digital systems with version control and continuous quality.',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 md:py-28 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-brand-violet/10 blur-[40px] sm:blur-[50px] pointer-events-none rounded-full" style={{ transform: 'translate3d(0,0,0)', WebkitTransform: 'translate3d(0,0,0)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-brand-cyan text-xs font-mono mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ABOUT ME</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Engineering Scalable Software & Modern Web Apps
          </h2>
          <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed">
            Best for general software engineering or full-stack web development roles.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          
          {/* Left: Bio & SLIIT Details */}
          <motion.div
            initial={{ opacity: 0.01, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-5 sm:space-y-6"
          >
            <div className="glass-card p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl relative overflow-hidden border border-white/[0.08]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 sm:p-2.5 rounded-xl bg-brand-violet/20 border border-brand-violet/40 text-brand-violet shrink-0">
                  <GraduationCap className="w-5 h-5 text-brand-cyan" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{personalInfo.university}</h3>
                  <p className="text-xs font-mono text-brand-cyan">{personalInfo.faculty} • {personalInfo.standing}</p>
                </div>
              </div>

              {/* Exact About Me from CV */}
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm md:text-base">
                {personalInfo.bio}
              </p>

              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-white/[0.06] space-y-3">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Proven ability in building collaborative platforms like <strong>'UniLance'</strong> with live chat and gig hub validation.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Engineered responsive MERN e-commerce platforms and centralized staff HR portals with MySQL.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Equipped with strong technical problem-solving skills, eager to add value in a dynamic engineering team.</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2 overflow-hidden">
                <Mail className="w-4 h-4 text-brand-cyan shrink-0" />
                <span className="text-slate-200 truncate">{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">{personalInfo.phoneFormatted}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Interactive Code Window / Dev Config */}
          <motion.div
            initial={{ opacity: 0.01, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 w-full"
          >
            <div className="rounded-2xl overflow-hidden border border-white/[0.1] bg-dark-900/90 shadow-2xl backdrop-blur-xl">
              {/* Window Title Bar */}
              <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white/[0.03] border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  <span className="text-[11px] sm:text-xs font-mono text-slate-400 ml-1.5 sm:ml-2">nirmal.profile.json</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">SLIIT Year 3</span>
              </div>

              {/* Code Snippet */}
              <div className="p-3.5 sm:p-5 font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed overflow-x-auto text-slate-300">
                <p><span className="text-slate-500">1</span>  &#123;</p>
                <p><span className="text-slate-500">2</span>    <span className="text-brand-violet">"name"</span>: <span className="text-brand-cyan">"{personalInfo.name}"</span>,</p>
                <p><span className="text-slate-500">3</span>    <span className="text-brand-violet">"university"</span>: <span className="text-brand-cyan">"SLIIT (Faculty of Computing)"</span>,</p>
                <p><span className="text-slate-500">4</span>    <span className="text-brand-violet">"standing"</span>: <span className="text-brand-cyan">"{personalInfo.standing}"</span>,</p>
                <p><span className="text-slate-500">5</span>    <span className="text-brand-violet">"focusAreas"</span>: [</p>
                <p><span className="text-slate-500">6</span>      <span className="text-emerald-400">"MERN Stack"</span>, <span className="text-emerald-400">"Java"</span>, <span className="text-emerald-400">"Spring Boot"</span>,</p>
                <p><span className="text-slate-500">7</span>      <span className="text-emerald-400">"Python"</span>, <span className="text-emerald-400">"Relational DB (MySQL)"</span>, <span className="text-emerald-400">"NoSQL (MongoDB)"</span></p>
                <p><span className="text-slate-500">8</span>    ],</p>
                <p><span className="text-slate-500">9</span>    <span className="text-brand-violet">"flagshipProject"</span>: <span className="text-amber-300">"UniLance Freelance Platform (SLIIT 3Y1S)"</span>,</p>
                <p><span className="text-slate-500">10</span>   <span className="text-brand-violet">"rolesTargeted"</span>: [</p>
                <p><span className="text-slate-500">11</span>     <span className="text-brand-cyan">"Full-Stack Web Development"</span>,</p>
                <p><span className="text-slate-500">12</span>     <span className="text-brand-cyan">"Software Engineering Intern"</span></p>
                <p><span className="text-slate-500">13</span>   ],</p>
                <p><span className="text-slate-500">14</span>   <span className="text-brand-violet">"references"</span>: <span className="text-slate-400">["Sithum Kavinda (Senior SE)", "Charitha Elvitigala (Bug Zero)"]</span></p>
                <p><span className="text-slate-500">15</span> &#123;</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Engineering Pillars */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0.01, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card-hover p-5 sm:p-6 rounded-2xl relative group"
              >
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr ${pillar.color} p-2.5 text-white mb-3 sm:mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 sm:mb-2">{pillar.title}</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{pillar.desc}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
