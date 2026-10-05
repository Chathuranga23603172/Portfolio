import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Code, Cpu, Server, Database, Globe, 
  Terminal, Shield, Layers, Flame, Box, GitBranch, 
  Send, Zap, Smartphone, Check, Palette, Layout
} from 'lucide-react';
import { skillsData } from '../data/portfolioData';

const iconMap = {
  React: Globe,
  Code: Code,
  Palette: Palette,
  Layout: Layout,
  Globe: Globe,
  Layers: Layers,
  Server: Server,
  Cpu: Cpu,
  Terminal: Terminal,
  Coffee: Cpu,
  Database: Database,
  GitBranch: GitBranch,
  Smartphone: Smartphone,
  Box: Box,
};

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeSkill, setActiveSkill] = useState(skillsData[0]);

  const categories = ['All', 'Full-Stack', 'Frontend', 'Backend', 'Databases', 'Tools'];

  const filteredSkills = selectedCategory === 'All'
    ? skillsData
    : skillsData.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="py-16 sm:py-20 md:py-28 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 right-1/4 w-[300px] sm:w-[500px] h-[200px] sm:h-[300px] bg-brand-cyan/10 blur-[100px] sm:blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-brand-violet/10 blur-[80px] sm:blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-mono mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TECHNICAL CAPABILITIES & PROFICIENCIES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Skills & Core Technologies
          </h2>
          <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base md:text-lg">
            Grounded in MERN stack, Java, Spring Boot, database management, and modern software engineering practices.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-12">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'text-white bg-gradient-to-r from-brand-violet to-brand-cyan shadow-lg shadow-brand-violet/20 border border-transparent'
                    : 'text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid of Animated Floating Glowing Badges */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          <AnimatePresence>
            {filteredSkills.map((skill, index) => {
              const IconComponent = iconMap[skill.icon] || Code;
              const isCurrent = activeSkill?.name === skill.name;

              return (
                <motion.div
                  layout
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  onClick={() => setActiveSkill(skill)}
                  className={`relative p-3.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isCurrent
                      ? 'bg-gradient-to-b from-brand-violet/20 to-brand-cyan/10 border-brand-cyan shadow-lg shadow-brand-cyan/20 ring-1 ring-brand-cyan/40'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-white/[0.2]'
                  }`}
                >
                  {/* Glowing backdrop dot */}
                  <div
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full opacity-60 blur-[2px]"
                    style={{ backgroundColor: skill.color }}
                  />

                  <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-transform"
                      style={{
                        backgroundColor: `${skill.color}15`,
                        border: `1px solid ${skill.color}40`,
                        color: skill.color,
                      }}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <div className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-full">
                      {skill.name}
                    </div>

                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 bg-white/[0.04] px-1.5 sm:px-2 py-0.5 rounded-md border border-white/[0.05]">
                      {skill.category}
                    </span>

                    {/* Progress bar */}
                    <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${skill.level}%`,
                          backgroundColor: skill.color,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Selected Skill Spotlight Card */}
        {activeSkill && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeSkill.name}
            className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl glass-card border border-brand-violet/30 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xl"
          >
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
              style={{
                backgroundColor: `${activeSkill.color}20`,
                border: `1px solid ${activeSkill.color}60`,
                color: activeSkill.color,
              }}
            >
              {React.createElement(iconMap[activeSkill.icon] || Code, { className: 'w-7 h-7 sm:w-8 sm:h-8' })}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1 sm:space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                <h4 className="text-base sm:text-lg font-bold text-white">{activeSkill.name}</h4>
                <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-md bg-white/[0.08] text-slate-300">
                  {activeSkill.category}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-brand-cyan font-semibold">
                  Proficiency: {activeSkill.level}%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeSkill.description}
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
