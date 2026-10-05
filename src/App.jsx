import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CvModal from './components/CvModal';

export default function App() {
  const [isCvOpen, setIsCvOpen] = useState(false);

  return (
    <div className="relative min-h-[100dvh] w-full max-w-full bg-[#05070a] text-slate-100 selection:bg-brand-violet/30 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Background ambient gradient orbs - Safari/WebKit optimized radial gradients */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
        style={{ transform: 'translate3d(0, 0, 0)', WebkitTransform: 'translate3d(0, 0, 0)' }}
      >
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.18)_0%,_transparent_70%)]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,_rgba(6,182,212,0.14)_0%,_transparent_70%)]" />
        <div className="absolute bottom-1/4 -left-20 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,_rgba(168,85,247,0.14)_0%,_transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-full">
        {/* Navigation Bar */}
        <Navbar onOpenCv={() => setIsCvOpen(true)} />

        {/* Main Content Sections */}
        <main>
          <Hero onOpenCv={() => setIsCvOpen(true)} />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Reviews />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Interactive CV Modal */}
        <CvModal isOpen={isCvOpen} onClose={() => setIsCvOpen(false)} />
      </div>

    </div>
  );
}
