
import React, { useState, useEffect } from 'react';
import { Menu, X, Briefcase, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
      setActiveDropdown(null);
    }
  };

  const handleSubLinkClick = (id: string, tab: string) => {
    scrollToSection(id);
    // Dispatch event to switch tab in Experience component
    const event = new CustomEvent('changeTab', { detail: tab });
    window.dispatchEvent(event);
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About Me', id: 'about' },
    { 
      name: 'Experience', 
      id: 'experience',
      // Updated order: Work -> Hard -> Soft -> Certs -> Volunteer
      subLinks: [
        { name: 'Work History', tab: 'work' },
        { name: 'Hard Skills', tab: 'hard' },
        { name: 'Soft Skills', tab: 'soft' },
        { name: 'Certifications', tab: 'certs' },
        { name: 'Volunteer', tab: 'volunteer' },
      ]
    },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 font-bold text-xl text-slate-800 cursor-pointer"
          onClick={() => scrollToSection('home')}
        >
          <div className="bg-teal-500 p-1.5 rounded-lg text-white shadow-lg shadow-teal-500/30">
            <Briefcase size={20} />
          </div>
          <span className="tracking-tight">Tu Truong</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <div 
              key={link.name} 
              className="relative group"
              onMouseEnter={() => setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => scrollToSection(link.id)}
                className="text-slate-600 hover:text-teal-600 font-medium transition-colors relative group flex items-center gap-1"
              >
                {link.name}
                {link.subLinks && <ChevronDown size={14} className="mt-0.5" />}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
              </button>

              {/* Dropdown */}
              {link.subLinks && (
                <div className={`absolute top-full left-0 pt-4 w-48 transition-all duration-200 ${
                  activeDropdown === link.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                }`}>
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-2">
                    {link.subLinks.map(sub => (
                      <button
                        key={sub.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubLinkClick(link.id, sub.tab);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="w-full text-left text-slate-800 font-bold py-2 hover:bg-slate-50 px-2 rounded-lg transition-colors flex justify-between items-center"
                  >
                    {link.name}
                  </button>
                  
                  {link.subLinks && (
                    <div className="pl-4 border-l-2 border-slate-100 ml-2 mt-1 space-y-1">
                      {link.subLinks.map(sub => (
                        <button
                          key={sub.name}
                          onClick={() => handleSubLinkClick(link.id, sub.tab)}
                          className="block w-full text-left py-2 px-2 text-sm text-slate-600 hover:text-teal-600"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
