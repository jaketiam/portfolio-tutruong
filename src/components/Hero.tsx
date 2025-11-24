import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Linkedin, Github, Mail, Download } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import type { Profile } from '../types';

const defaultProfile: Profile = {
  full_name: "Trương Thị Minh Tú",
  headline: "Aspiring Business Analyst | Future Product Manager",
  short_bio: " A dedicated fresh graduate ready to transform academic knowledge into real-world results. I bring a proactive mindset, strong analytical foundation, and an eagerness to tackle complex business challenges.",
  long_bio: "",
  avatar_url: "https://psmapgmzhykwenanwxph.supabase.co/storage/v1/object/public/portfolio/avatar-portfolio.jpg",
  email: "tutruong.dev@gmail.com",
  linkedin_url: "https://www.linkedin.com/in/tutruong23/",
  github_url: "https://github.com/tutruong-dev",
  // Default placeholder if no DB connection
  resume_url: "/CV_TruongThiMinhTu_BA.pdf" 
};

export const Hero: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isSupabaseConfigured()) return;

      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .single();
        
        if (data && !error) {
          setProfile({ 
            ...defaultProfile, 
            ...data,
            // Prioritize DB URL, fallback to local file if empty
            resume_url: data.resume_url || defaultProfile.resume_url 
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden relative bg-slate-50/50">
      <div className="grid md:grid-cols-2 gap-12 items-center w-full">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 md:order-1"
        >
          <div className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-bold tracking-wide mb-6 border border-teal-100">
            {profile.headline}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Transforming Requirements <br />
            into <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">
              Tangible Results
            </span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            Hi, I'm <span className="font-semibold text-slate-900">{profile.full_name}</span>. 
            {profile.short_bio}
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mr-2">Follow Me:</span>
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all transform hover:-translate-y-1 shadow-sm group">
                <Linkedin size={20} />
              </a>
            )}
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-white hover:bg-[#333] hover:border-[#333] transition-all transform hover:-translate-y-1 shadow-sm">
                <Github size={20} />
              </a>
            )}
            <a href={`mailto:${profile.email}`} className="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-white hover:bg-teal-500 hover:border-teal-500 transition-all transform hover:-translate-y-1 shadow-sm">
              <Mail size={20} />
            </a>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={scrollToContact}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transform hover:-translate-y-0.5"
            >
              Contact Me <ArrowRight size={18} />
            </button>
            
            {/* Dynamic Resume Link */}
            <a 
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              download={profile.resume_url?.startsWith('http') ? undefined : "CV_TruongThiMinhTu_BA.pdf"} // Only add download attribute if local file
              className="bg-white border-2 border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 px-8 py-3.5 rounded-full font-semibold transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Download size={18} />
              Download CV
            </a>
          </div>
        </motion.div>

        {/* Visual Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative order-1 md:order-2 flex justify-center"
        >
          {/* Abstract blobs/shapes background - Updated to Turquoise */}
          <div className="absolute -z-10 top-0 right-10 w-72 h-72 bg-teal-200 rounded-full blur-3xl opacity-40 mix-blend-multiply animate-pulse"></div>
          <div className="absolute -z-10 bottom-0 left-10 w-72 h-72 bg-cyan-200 rounded-full blur-3xl opacity-40 mix-blend-multiply animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="relative">
            {/* Circular Avatar */}
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[6px] border-white shadow-2xl shadow-teal-100 overflow-hidden bg-slate-100 relative z-10 mx-auto">
               <img 
                 src={profile.avatar_url} 
                 alt="Profile" 
                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
               />
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};