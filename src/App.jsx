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
    <div className="relative min-h-screen w-full max-w-full bg-dark-950 text-slate-100 selection:bg-brand-violet/30 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Background ambient gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-violet/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 -left-20 w-[450px] h-[450px] bg-brand-purple/10 rounded-full blur-[150px]" />
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
