import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Sparkles, Building2, UserCheck, Phone, Mail, Award, BookOpen } from 'lucide-react';
import { educationData, referencesData } from '../data/portfolioData';

export default function Experience() {
  return (
    <section id="experience" className="py-16 sm:py-20 md:py-28 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 right-4 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-brand-violet/10 blur-[40px] sm:blur-[50px] pointer-events-none rounded-full" style={{ transform: 'translate3d(0,0,0)', WebkitTransform: 'translate3d(0,0,0)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-mono mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACADEMIC FOUNDATION & REFERENCES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Education & Industry Endorsements
          </h2>
          <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base md:text-lg">
            Academic credentials from SLIIT and Dharmapala Vidyalaya Pannipitiya, backed by trusted professional references.
          </p>
        </div>

        {/* Education Timeline */}
        <div className="max-w-4xl mx-auto relative mb-14 sm:mb-20">
          
          {/* Vertical Center Line (at left-3 on mobile, center on sm+) */}
          <div className="absolute left-3.5 sm:left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-brand-violet via-brand-cyan to-transparent opacity-40" />

          <div className="space-y-8 sm:space-y-12">
            {educationData.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={item.institution + item.period}
                  initial={{ opacity: 0.01, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } gap-4 sm:gap-12 pl-10 sm:pl-0`}
                >
                  {/* Timeline Glowing Node */}
                  <div className="absolute left-3.5 sm:left-1/2 -translate-x-1/2 top-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-dark-900 border-2 border-brand-cyan flex items-center justify-center shadow-lg shadow-brand-cyan/20 z-10">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-cyan animate-pulse" />
                  </div>

                  {/* Content Card */}
                  <div className={`w-full sm:w-1/2 ${isEven ? 'sm:text-left sm:pr-8' : 'sm:pl-8'}`}>
                    <div className="glass-card-hover p-4 sm:p-6 sm:p-7 rounded-2xl border border-white/[0.08] relative group">
                      
                      {/* Period Badge */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] sm:text-xs font-mono text-brand-cyan mb-2.5 sm:mb-3">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{item.period}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">
                        {item.institution}
                      </h3>

                      <div className="text-xs sm:text-sm font-semibold text-brand-violet mt-0.5 mb-2 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 shrink-0" />
                        <span>{item.faculty}</span>
                      </div>

                      <div className="inline-block px-2 sm:px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] sm:text-xs font-mono text-emerald-400 mb-2.5 sm:mb-3">
                        {item.standing}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {item.details}
                      </p>

                    </div>
                  </div>

                  {/* Spacer for alternate layout */}
                  <div className="hidden sm:block sm:w-1/2" />
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Professional References Section */}
        <div className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-white/[0.08]">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-brand-cyan text-xs font-mono mb-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>INDUSTRY ENDORSEMENTS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Professional References</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Experienced software engineering mentors and industry directors available upon request.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {referencesData.map((ref) => (
              <motion.div
                key={ref.name}
                whileHover={{ y: -4 }}
                className="glass-card-hover p-4 sm:p-6 rounded-2xl border border-white/[0.08] relative group"
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-cyan transition-colors">
                      {ref.name}
                    </h4>
                    <span className="text-xs font-medium text-brand-violet block">
                      {ref.role}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {ref.company}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-300 shrink-0">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-cyan" />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2 pt-3 border-t border-white/[0.06] text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{ref.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">{ref.email}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
