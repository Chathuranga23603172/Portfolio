import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Phone, Mail, Globe, MapPin, ExternalLink, GraduationCap, Briefcase, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { personalInfo, academicProjects, educationData, referencesData } from '../data/portfolioData';

export default function CvModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    const link = document.createElement('a');
    link.href = personalInfo.cvPdfUrl;
    link.download = 'Nirmal_Chathuranga_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:backdrop-blur-none">
        
        {/* Backdrop dismiss */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0.01, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0.01, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-dark-900 border border-white/[0.1] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-4 sm:my-8 print:border-none print:shadow-none print:m-0 print:bg-white print:text-black"
        >
          {/* Header Controls (Hidden on Print) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white/[0.03] border-b border-white/[0.08] gap-2 print:hidden">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs sm:text-sm">Curriculum Vitae</span>
              <span className="text-[10px] sm:text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Official CV PDF Ready
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleDownloadPdf}
                className="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan hover:opacity-95 text-[11px] sm:text-xs font-semibold text-white transition-opacity flex items-center gap-1.5 cursor-pointer shadow-md shadow-brand-violet/20"
                id="cv-modal-download-official-pdf"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Download</span>
                <span>PDF</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[11px] sm:text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Print
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Resume Body mirroring CV layout */}
          <div className="p-4 sm:p-8 md:p-12 space-y-6 sm:space-y-8 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 print:text-black">
            
            {/* Header with Photo & Bio */}
            <div className="border-b border-white/[0.08] print:border-slate-300 pb-6 sm:pb-8 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                <img
                  src={personalInfo.profilePhoto}
                  alt={personalInfo.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl object-cover object-top border-2 border-brand-violet shadow-lg print:border-slate-400"
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white print:text-black tracking-tight uppercase">
                    {personalInfo.name}
                  </h1>
                  <p className="text-sm sm:text-base font-semibold text-brand-cyan print:text-indigo-700 mt-0.5 sm:mt-1">
                    Undergraduate Student ({personalInfo.university})
                  </p>
                  <p className="text-[11px] sm:text-xs font-mono text-slate-400 print:text-slate-600 mt-0.5">
                    {personalInfo.faculty} • {personalInfo.standing}
                  </p>
                </div>
              </div>

              <div className="space-y-1 sm:space-y-1.5 text-xs font-mono text-slate-300 print:text-slate-700 sm:text-right">
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 print:text-black shrink-0" />
                  <span>{personalInfo.phoneFormatted}</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-cyan print:text-black shrink-0" />
                  <span className="truncate">{personalInfo.email}</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-brand-violet print:text-black shrink-0" />
                  <span className="truncate">{personalInfo.websiteUrl}</span>
                </div>
              </div>
            </div>

            {/* About Me Section from CV */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-violet print:text-indigo-800 mb-2 border-b border-white/[0.05] print:border-slate-200 pb-1">
                ABOUT ME
              </h2>
              <p className="text-[10px] sm:text-[11px] font-mono text-slate-400 print:text-slate-500 italic mb-2">
                Best for general software engineering or full-stack web development roles
              </p>
              <p className="text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed">
                {personalInfo.bio}
              </p>
            </div>

            {/* Academic Projects from CV */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-violet print:text-indigo-800 mb-3 border-b border-white/[0.05] print:border-slate-200 pb-1">
                PROJECTS
              </h2>
              <div className="space-y-3.5 sm:space-y-4">
                {academicProjects.map((proj) => (
                  <div key={proj.id} className="p-3 sm:p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] print:border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs sm:text-sm text-white print:text-black">
                        {proj.title}
                      </span>
                      <span className="text-[11px] sm:text-xs font-mono text-brand-cyan print:text-slate-600">
                        {proj.semester} • {proj.institution}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
                      {proj.tech.map((t) => (
                        <span key={t} className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 print:border print:border-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education from CV */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-violet print:text-indigo-800 mb-3 border-b border-white/[0.05] print:border-slate-200 pb-1">
                EDUCATION
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {educationData.map((edu) => (
                  <div key={edu.period + edu.institution} className="p-3 sm:p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] print:border-slate-200">
                    <span className="text-[10px] font-mono text-brand-cyan print:text-indigo-700 block mb-0.5 sm:mb-1">
                      {edu.period}
                    </span>
                    <span className="font-bold text-xs text-white print:text-black block mb-0.5">
                      {edu.institution}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 block mb-1.5 sm:mb-2">
                      {edu.standing}
                    </span>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 print:text-slate-700 leading-snug">
                      {edu.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills from CV */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-violet print:text-indigo-800 mb-3 border-b border-white/[0.05] print:border-slate-200 pb-1">
                SKILLS
              </h2>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  "HTML", "PHP", "Version Control", "JAVA", "UI/UX Design",
                  "Front-End", "C", "React", "Python", "C++",
                  "Database Management", "Kotlin", "MERN", "JavaScript"
                ].map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] sm:text-xs font-mono text-slate-200 print:border-slate-300 print:text-black"
                  >
                    • {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* References from CV */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-violet print:text-indigo-800 mb-3 border-b border-white/[0.05] print:border-slate-200 pb-1">
                REFERENCES
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {referencesData.map((ref) => (
                  <div key={ref.name} className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] print:border-slate-200">
                    <span className="font-bold text-xs sm:text-sm text-white print:text-black block">
                      {ref.name}
                    </span>
                    <span className="text-[11px] sm:text-xs text-brand-cyan print:text-indigo-700 block mb-1.5 sm:mb-2">
                      {ref.role} • {ref.company}
                    </span>
                    <div className="text-[11px] sm:text-xs font-mono text-slate-300 print:text-slate-700 space-y-1">
                      <div>Phone: {ref.phone}</div>
                      <div className="truncate">Email: {ref.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between text-[11px] sm:text-xs font-mono text-slate-400 print:hidden">
            <span className="truncate max-w-[200px] xs:max-w-none">Verified SLIIT Computing Portfolio</span>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white underline cursor-pointer shrink-0"
            >
              Close Window
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
