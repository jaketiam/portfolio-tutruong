
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle, Trophy, Users, Heart, Code, MessageCircle, Brain, Layout, Lightbulb, Star, Briefcase, Calendar, ArrowRight, X, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import type { Achievement, Skill } from '../types';

type Category = 'work' | 'certs' | 'hard' | 'soft' | 'volunteer';

// Updated order: Work -> Hard -> Soft -> Certs -> Volunteer
const tabs: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'work', label: 'Work Experience', icon: <Briefcase size={18} /> },
  { id: 'hard', label: 'Hard Skills', icon: <Code size={18} /> },
  { id: 'soft', label: 'Soft Skills', icon: <MessageCircle size={18} /> },
  { id: 'certs', label: 'Certifications', icon: <Award size={18} /> },
  { id: 'volunteer', label: 'Volunteer', icon: <Heart size={18} /> },
];

// Sub-filters for the Certifications tab
const certFilters = ['All', 'Certification', 'Award', 'Academic', 'Scholarship', 'Extracurricular'];

// Icon mapper for dynamic icons from DB
const IconMapper: Record<string, React.ReactNode> = {
  'CheckCircle': <CheckCircle className="text-teal-500" />,
  'Brain': <Brain className="text-teal-500" />,
  'Users': <Users className="text-cyan-500" />,
  'Trophy': <Trophy className="text-yellow-500" />,
  'Heart': <Heart size={24} />,
  'MessageCircle': <MessageCircle />,
  'Lightbulb': <Lightbulb />,
  'Layout': <Layout size={20} />,
  'Code': <Code size={20} />,
  'Star': <Star size={20} />,
  'Award': <Award size={20} />
};

export const Experience: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>('work');
  const [experiences, setExperiences] = useState<Achievement[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showAllCerts, setShowAllCerts] = useState(false);
  
  // Filter state for Certifications tab
  const [certFilter, setCertFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured()) return;

      // Fetch Experiences
      const { data: expData } = await supabase.from('experiences').select('*');
      if (expData) {
         // Map DB fields to our internal types
         const mappedExps = expData.map((e: any) => ({
            id: e.id,
            title: e.title,
            organization: e.organization,
            // Construct a display date string from start/end
            date: e.start_date + (e.end_date ? ` - ${e.end_date}` : ''),
            description: e.description,
            icon: e.icon_name,
            type: e.type,
            subtype: e.subtype || 'Certification', // Default to Certification if null
            image_url: e.image_url
         }));
         setExperiences(mappedExps);
      }

      // Fetch Skills
      const { data: skillData } = await supabase.from('skills').select('*').order('level', { ascending: false });
      if (skillData) setSkills(skillData);
    };
    fetchData();
  }, []);

  // Listen for Navbar dropdown events
  useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('changeTab' as any, handleTabChange);
    return () => window.removeEventListener('changeTab' as any, handleTabChange);
  }, []);

  // Filter and Sort Data
  const workExperiences = experiences
    .filter(e => e.type === 'work')
    .sort((a, b) => {
       const getYear = (d: string) => {
         const match = d.match(/\d{4}/);
         return match ? parseInt(match[0]) : 0;
       };
       return getYear(b.date) - getYear(a.date);
    });
  
  const volunteers = experiences
    .filter(e => e.type === 'volunteer')
    .sort((a, b) => {
       const getYear = (d: string) => {
         const match = d.match(/\d{4}/);
         return match ? parseInt(match[0]) : 0;
       };
       return getYear(b.date) - getYear(a.date);
    });

  // Main Certifications List (filtered by tab)
  const allCertifications = experiences.filter(e => e.type === 'certification');
  
  const displayedCertifications = allCertifications.filter(c => {
    if (certFilter === 'All') return true;
    return c.subtype === certFilter;
  });

  const hardSkills = skills.filter(s => s.category === 'technical');
  const softSkills = skills.filter(s => s.category === 'soft');

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Helper to clean text from bullets for list rendering
  const cleanText = (text: string) => text.replace(/^[•\-*]\s*/, '').trim();

  const renderTimelineItem = (item: Achievement, colorClass: string, icon: React.ReactNode) => {
    const lines = item.description.split(/(?:\\n|\r\n|\r|\n)/g).filter(line => line.trim().length > 0);
    const isLong = lines.length > 2;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id} className="relative pl-8 md:pl-10 pb-12 last:pb-0 group">
        {/* Timeline Line */}
        <div className="absolute left-[11px] top-2 bottom-0 w-0.5 bg-slate-200 group-last:bg-transparent"></div>
        {/* Timeline Dot */}
        <div className={`absolute left-0 top-2 w-6 h-6 rounded-full bg-white border-4 ${colorClass} shadow-sm flex items-center justify-center`}>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative top-[-6px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
            <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold whitespace-nowrap">
              <Calendar size={12} /> {item.date}
            </span>
          </div>
          <h4 className={`font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide ${colorClass.replace('border-', 'text-')}`}>
            {icon} {item.organization}
          </h4>

          <div className="text-slate-600 leading-relaxed space-y-2">
             {/* Use list-disc but clean the text content first to avoid double bullets */}
             <ul className="list-disc ml-5 space-y-1 marker:text-slate-400">
                {lines.slice(0, 2).map((line, i) => (
                  <li key={i}>{cleanText(line)}</li>
                ))}
                
                {/* Conditionally show the rest */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                       {lines.slice(2).map((line, i) => (
                          <li key={i + 2}>{cleanText(line)}</li>
                       ))}
                    </motion.div>
                  )}
                </AnimatePresence>
             </ul>
          </div>

          {isLong && (
             <button 
                onClick={() => toggleItem(item.id)}
                className={`mt-3 flex items-center gap-1 text-sm font-bold hover:underline transition-colors ${colorClass.replace('border-', 'text-')}`}
             >
                {isExpanded ? 'View Less' : 'View Details'}
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
             </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Professional Experience</h2>
        <div className="w-16 h-1 bg-teal-500 rounded-full mb-8"></div>
        
        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* WORK EXPERIENCE TAB */}
          {activeTab === 'work' && (
            <motion.div
              key="work"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="space-y-0">
                {workExperiences.map((job) => renderTimelineItem(job, 'border-teal-500', <Briefcase size={14} />))}
              </div>
            </motion.div>
          )}

          {/* HARD SKILLS TAB */}
          {activeTab === 'hard' && (
            <motion.div
              key="hard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {hardSkills.map((skill) => (
                 <div key={skill.id} className="bg-white p-4 rounded-xl border border-slate-100 text-center hover:border-teal-200 transition-colors group relative overflow-hidden">
                    <div className="w-12 h-12 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-teal-50 transition-colors">
                       {skill.icon_name && IconMapper[skill.icon_name] ? IconMapper[skill.icon_name] : <Code className="text-slate-400 group-hover:text-teal-500" />}
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">{skill.name}</h4>
                    
                    <div className="flex items-center gap-2">
                       <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${skill.level}%` }}></div>
                       </div>
                       <span className="text-xs font-bold text-teal-600 w-8 text-right">{skill.level}%</span>
                    </div>
                 </div>
              ))}
            </motion.div>
          )}

          {/* SOFT SKILLS TAB */}
          {activeTab === 'soft' && (
             <motion.div
              key="soft"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto"
             >
                {softSkills.map((skill) => (
                  <div key={skill.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                     <div className="p-3 bg-purple-50 text-purple-500 rounded-full">
                        {skill.icon_name && IconMapper[skill.icon_name] ? IconMapper[skill.icon_name] : <MessageCircle size={24} />}
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 text-lg">{skill.name}</h4>
                        <p className="text-slate-500 text-sm">{skill.description}</p>
                     </div>
                  </div>
                ))}
             </motion.div>
          )}

          {/* CERTIFICATIONS TAB */}
          {activeTab === 'certs' && (
            <motion.div
              key="certs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              {/* Filter Bar */}
              <div className="flex overflow-x-auto pb-4 mb-4 gap-2 no-scrollbar justify-start md:justify-center">
                {certFilters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setCertFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      certFilter === filter 
                      ? 'bg-teal-100 text-teal-700 border border-teal-200' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {displayedCertifications.slice(0, 4).map((cert) => (
                  <div key={cert.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                     {/* Image Container */}
                     <div className="w-full h-56 bg-slate-50 rounded-xl mb-4 overflow-hidden border border-slate-100 flex items-center justify-center relative group">
                       {cert.image_url ? (
                         <img 
                           src={cert.image_url} 
                           alt={cert.title} 
                           className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" 
                         />
                       ) : (
                         <div className="p-4 bg-teal-50 text-teal-600 rounded-full">
                           <Award size={48} />
                         </div>
                       )}
                     </div>
                     
                     <div className="flex-grow">
                       <h4 className="font-bold text-slate-900 mb-1.5 text-lg leading-tight">{cert.title}</h4>
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-teal-600">{cert.organization}</span>
                          <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{cert.date}</span>
                       </div>
                       <p className="text-sm text-slate-500 line-clamp-2">{cert.description}</p>
                     </div>
                  </div>
                ))}
              </div>
              
              {/* View All Button */}
              <div className="md:col-span-2 flex justify-center mt-8">
                <button 
                  onClick={() => setShowAllCerts(true)}
                  className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full text-slate-600 font-semibold hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all shadow-sm hover:shadow-md"
                >
                  View All {allCertifications.length} Achievements <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* VOLUNTEER TAB */}
          {activeTab === 'volunteer' && (
             <motion.div
              key="volunteer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
             >
               <div className="space-y-0">
                {volunteers.map((vol) => renderTimelineItem(vol, 'border-red-500', <Heart size={14} />))}
               </div>
             </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* MODAL FOR ALL CERTIFICATIONS */}
      <AnimatePresence>
        {showAllCerts && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllCerts(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex flex-col">
                   <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                     <Award className="text-teal-500" /> All Achievements
                   </h3>
                   <span className="text-sm text-slate-500">Certifications, Awards, & Honors</span>
                 </div>
                 <button onClick={() => setShowAllCerts(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                   <X size={20} />
                 </button>
              </div>

              {/* Modal Filters */}
              <div className="px-6 pt-4 pb-0 flex gap-2 overflow-x-auto no-scrollbar">
                  {certFilters.map(filter => (
                    <button
                      key={filter}
                      onClick={() => setCertFilter(filter)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        certFilter === filter 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
              </div>

              <div className="overflow-y-auto p-6 grid md:grid-cols-2 gap-6">
                {allCertifications.filter(c => certFilter === 'All' || c.subtype === certFilter).map((cert) => (
                  <div key={cert.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-4 relative hover:shadow-md transition-all">
                     
                     <div className="w-full h-64 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center">
                        {cert.image_url ? (
                          <img src={cert.image_url} alt={cert.title} className="w-full h-full object-contain p-2" />
                        ) : (
                          <Award className="text-slate-300" size={64} />
                        )}
                     </div>

                     <div>
                       <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1">{cert.title}</h4>
                       <div className="flex justify-between items-center mb-2">
                          <p className="text-teal-600 font-medium text-sm">{cert.organization}</p>
                          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">{cert.date}</span>
                       </div>
                       <p className="text-slate-600 text-sm">{cert.description}</p>
                     </div>
                  </div>
                ))}
                {allCertifications.filter(c => certFilter === 'All' || c.subtype === certFilter).length === 0 && (
                  <div className="col-span-2 text-center py-12 text-slate-400">
                    No items found in this category.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
