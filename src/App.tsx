
import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { ChatWidget } from './components/ChatWidget';
import { ScrollToTop } from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-8 max-w-7xl">
        <section id="home">
          <Hero />
        </section>
        
        <section id="about" className="py-10 md:py-16">
          <About />
        </section>

        <section id="experience" className="py-10 md:py-16">
          <Experience />
        </section>

        <section id="projects" className="py-10 md:py-16">
          <Projects />
        </section>

        <section id="contact" className="py-10 md:py-16 mb-8">
          <Contact />
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center mt-0">
        <p>&copy; {new Date().getFullYear()} © 2025 Tu Truong. Built with React, Supabase & Gemini AI.</p>
      </footer>

      {/* Utilities */}
      <ScrollToTop />
      <ChatWidget />
    </div>
  );
};

export default App;
