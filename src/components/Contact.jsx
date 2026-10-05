import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, MapPin, Send, CheckCircle2, 
  Copy, Check, Sparkles, Phone, ArrowUpRight, 
  AlertCircle, X, Info
} from 'lucide-react';
import { GithubIcon as Github, LinkedinIcon as Linkedin } from './Icons';
import confetti from 'canvas-confetti';
import { personalInfo } from '../data/portfolioData';
import { sendContactEmail, isEmailConfigured } from '../services/emailService';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [toast, setToast] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errors.name = 'Your name is required.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Your email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    if (!formData.message.trim()) {
      errors.message = 'Please enter a message.';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({
        type: 'error',
        message: 'Please resolve form errors before submitting.',
      });
      return;
    }

    setStatus('sending');
    setToast(null);

    try {
      if (isEmailConfigured()) {
        await sendContactEmail(formData);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1400));
        console.warn(
          'EmailJS is in demo mode because VITE_EMAILJS_SERVICE_ID is not configured in .env'
        );
      }

      setStatus('success');
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6'],
      });

      const successDetail = isEmailConfigured()
        ? 'Your email has been dispatched directly to chathuranganirmal631@gmail.com!'
        : 'Message captured! (Add EmailJS keys to .env for live inbox delivery).';

      setToast({
        type: 'success',
        message: 'Message Sent Successfully!',
        detail: successDetail,
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      console.error('Failed to send email:', err);
      setStatus('error');
      setToast({
        type: 'error',
        message: 'Failed to Send Email',
        detail: err.text || err.message || 'An error occurred while connecting to the email service.',
      });
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(personalInfo.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-28 relative">
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/4 w-[300px] sm:w-[500px] h-[200px] sm:h-[300px] bg-brand-violet/10 blur-[100px] sm:blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-4 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-brand-cyan/10 blur-[80px] sm:blur-[110px] pointer-events-none rounded-full" />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 sm:top-24 left-3 right-3 sm:left-auto sm:right-8 z-50 max-w-md w-auto sm:w-full shadow-2xl"
          >
            <div
              className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-xl border flex items-start gap-2.5 sm:gap-3 ${
                toast.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-xs sm:text-sm text-white">{toast.message}</h5>
                {toast.detail && (
                  <p className="text-[11px] sm:text-xs opacity-90 mt-1 leading-relaxed break-words">
                    {toast.detail}
                  </p>
                )}
              </div>
              <button
                onClick={() => setToast(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-brand-violet text-xs font-mono mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span>LET'S CONNECT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Get In Touch
          </h2>
          <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base md:text-lg">
            Have a project in mind, looking for a full-stack developer, or offering an internship? Send a message directly to my inbox at <span className="text-brand-cyan font-mono font-medium break-all">chathuranganirmal631@gmail.com</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Left Column: Direct Contact Info & Profiles */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-4 sm:space-y-6"
          >
            <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/[0.08] space-y-5 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-bold text-white">Direct Information</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Available for internships, freelance inquiries, and full-stack software development opportunities.
              </p>

              <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                {/* Primary Destination Email Card */}
                <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] group hover:border-brand-violet/40 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden min-w-0">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-brand-violet/10 text-brand-cyan shrink-0">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <span className="block text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase">Primary Email</span>
                      <a
                        href="mailto:chathuranganirmal631@gmail.com"
                        className="text-xs sm:text-sm font-medium text-white hover:text-brand-cyan truncate block transition-colors font-mono"
                      >
                        chathuranganirmal631@gmail.com
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('chathuranganirmal631@gmail.com');
                      setCopiedEmail(true);
                      setTimeout(() => setCopiedEmail(false), 2500);
                    }}
                    className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0 ml-2"
                    title="Copy email to clipboard"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone Card */}
                <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] group hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden min-w-0">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <span className="block text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase">Phone</span>
                      <a
                        href={`tel:${personalInfo.phone}`}
                        className="text-xs sm:text-sm font-medium text-white hover:text-emerald-400 truncate block transition-colors font-mono"
                      >
                        {personalInfo.phoneFormatted}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyPhone}
                    className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0 ml-2"
                    title="Copy phone to clipboard"
                  >
                    {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Location Card */}
                <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-brand-cyan/10 text-brand-cyan shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase">Location</span>
                    <span className="text-xs sm:text-sm font-medium text-white truncate block">{personalInfo.location}</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-3 sm:pt-4 border-t border-white/[0.06]">
                <span className="block text-[11px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5 sm:mb-3">
                  Online Profiles:
                </span>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3">
                  <a
                    href={personalInfo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-brand-violet/40 text-slate-200 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-brand-cyan shrink-0" />
                      <span className="text-xs font-semibold">GitHub</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <a
                    href={personalInfo.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-brand-violet/40 text-slate-200 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-brand-violet shrink-0" />
                      <span className="text-xs font-semibold">LinkedIn</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Contact Form with Live Backend Delivery */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/[0.08] relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">Send a Direct Message</h3>
                <span className="text-[10px] sm:text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 self-start sm:self-auto">
                  Direct to chathuranganirmal631@gmail.com
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mb-5 sm:mb-6">
                Fill in the details below. All inquiries are delivered directly to Nirmal's primary Gmail address.
              </p>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 sm:py-12 text-center space-y-3 sm:space-y-4"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white">Message Dispatched!</h4>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you! Your message has been sent to <span className="text-brand-cyan font-mono break-all">chathuranganirmal631@gmail.com</span>. I will review and reply as soon as possible.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan text-xs font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4" id="contact-form" noValidate>
                  
                  {/* Name Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] sm:text-xs font-mono text-slate-400 uppercase" htmlFor="contact-name">
                        YOUR NAME <span className="text-rose-400">*</span>
                      </label>
                      {fieldErrors.name && (
                        <span className="text-[11px] sm:text-xs text-rose-400 flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {fieldErrors.name}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Sithum Kavinda / Engineering Manager"
                      className={`w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-dark-950/80 border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        fieldErrors.name
                          ? 'border-rose-500/70 focus:border-rose-400'
                          : 'border-white/[0.1] focus:border-brand-violet'
                      }`}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] sm:text-xs font-mono text-slate-400 uppercase" htmlFor="contact-email">
                        YOUR EMAIL <span className="text-rose-400">*</span>
                      </label>
                      {fieldErrors.email && (
                        <span className="text-[11px] sm:text-xs text-rose-400 flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {fieldErrors.email}
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. manager@techcompany.com"
                      className={`w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-dark-950/80 border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        fieldErrors.email
                          ? 'border-rose-500/70 focus:border-rose-400'
                          : 'border-white/[0.1] focus:border-brand-violet'
                      }`}
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-mono text-slate-400 uppercase mb-1.5" htmlFor="contact-subject">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Full-Stack Developer Internship / Freelance Project"
                      className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-dark-950/80 border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-violet transition-colors"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] sm:text-xs font-mono text-slate-400 uppercase" htmlFor="contact-message">
                        YOUR MESSAGE <span className="text-rose-400">*</span>
                      </label>
                      {fieldErrors.message && (
                        <span className="text-[11px] sm:text-xs text-rose-400 flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {fieldErrors.message}
                        </span>
                      )}
                    </div>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi Nirmal, we reviewed your SLIIT projects and would like to invite you for an interview..."
                      className={`w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-dark-950/80 border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none ${
                        fieldErrors.message
                          ? 'border-rose-500/70 focus:border-rose-400'
                          : 'border-white/[0.1] focus:border-brand-violet'
                      }`}
                    />
                  </div>

                  {/* Submit Button with Loading Spinner */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-3 sm:py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-violet to-brand-cyan hover:opacity-95 shadow-lg shadow-brand-violet/25 hover:shadow-brand-violet/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    id="contact-submit-btn"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="truncate">Sending to chathuranganirmal631@gmail.com...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  {/* Security & Destination Guarantee */}
                  <div className="pt-1.5 sm:pt-2 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono text-slate-500 text-center">
                    <Info className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span>Protected with client validation & automated delivery</span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
