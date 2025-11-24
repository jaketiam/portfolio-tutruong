
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types';
import { FileText, HardDrive, ExternalLink, Layout } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const defaultProjects: Project[] = [
  {
    id: 'p1',
    title: 'E-commerce Requirement Analysis',
    role: 'Lead Business Analyst (Capstone)',
    description: 'Conducted comprehensive requirement gathering for a mock local fashion brand expanding to e-commerce. Delivered BRD, SRS, and high-fidelity wireframes using Figma.',
    tools: ['Figma', 'UML', 'Jira', 'SRS'],
    image: 'https://picsum.photos/600/400?random=1',
    link: 'https://drive.google.com/file/d/xyz'
  },
  {
    id: 'p2',
    title: 'Library Management System Optimization',
    role: 'Process Analyst',
    description: 'Analyzed the "As-Is" check-out process of the university library and proposed a "To-Be" model reducing wait times by 30%. Modeled processes using BPMN 2.0.',
    tools: ['BPMN.io', 'Visio', 'Excel'],
    image: 'https://picsum.photos/600/400?random=2'
  }
];

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!isSupabaseConfigured()) return;

      try {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0 && !error) {
          const mappedProjects = data.map(p => ({
            id: p.id,
            title: p.title,
            role: p.role || 'Business Analyst',
            description: p.description,
            tools: p.tools || [],
            image: p.image_url || 'https://picsum.photos/600/400',
            link: p.link
          }));
          setProjects(mappedProjects);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Helper to determine button style based on link type
  const getLinkDetails = (link: string) => {
    if (!link) return null;
    
    const lowerLink = link.toLowerCase();
    
    if (lowerLink.includes('drive.google.com')) {
      return { label: 'Open Google Drive', icon: <HardDrive size={18} /> };
    }
    if (lowerLink.includes('figma.com')) {
      return { label: 'Open Figma Design', icon: <Layout size={18} /> };
    }
    if (lowerLink.endsWith('.pdf') || lowerLink.endsWith('.doc') || lowerLink.endsWith('.docx')) {
      return { label: 'View Document', icon: <FileText size={18} /> };
    }
    
    // Default for websites / other links
    return { label: 'View Project', icon: <ExternalLink size={18} /> };
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 px-4">
        <div>
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Projects</h2>
           <div className="w-16 h-1 bg-teal-500 rounded-full mb-4"></div>
           <p className="text-slate-600 max-w-lg">
             Applying theory to practice. Key projects demonstrating my analysis and documentation skills.
           </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => {
            const linkDetails = project.link ? getLinkDetails(project.link) : null;
            
            return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:border-teal-200 flex flex-col h-full"
                >
                    {/* Image Area */}
                    <div className="h-48 overflow-hidden relative shrink-0 border-b border-slate-50">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Overlay: Click anywhere on image to open link */}
                        {project.link && (
                           <a 
                             href={project.link} 
                             target="_blank" 
                             rel="noreferrer" 
                             className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors cursor-pointer"
                             aria-label={linkDetails?.label}
                           ></a>
                        )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                        {/* Role Badge */}
                        <div className="mb-3">
                           <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-100 uppercase tracking-wide">
                             {project.role}
                           </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors leading-tight">
                            {project.title}
                        </h3>

                        {/* Tools */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.tools.map(tool => (
                                <span key={tool} className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                    {tool}
                                </span>
                            ))}
                        </div>

                        {/* Description - Smart Bullet Point Handling */}
                        <div className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                           {project.description.split(/(?:\\n|\r\n|\r|\n)/g).map((line, i) => {
                             const trimmedLine = line.trim();
                             if (!trimmedLine) return null;
                             
                             const isBullet = /^[•\-*]/.test(trimmedLine);
                             const content = trimmedLine.replace(/^[•\-*]\s*/, '').trim();

                             if (isBullet) {
                               return (
                                 <div key={i} className="flex items-start gap-2 mb-1">
                                   <span className="mt-1.5 w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0" />
                                   <span>{content}</span>
                                 </div>
                               );
                             }
                             return <p key={i} className="mb-1">{content}</p>
                           })}
                        </div>
                        
                        {/* Footer Action - Full Width Button */}
                        <div className="mt-auto pt-4 border-t border-slate-50">
                            {project.link ? (
                                <a 
                                    href={project.link}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-slate-900/10 hover:shadow-teal-500/30 transform hover:-translate-y-0.5"
                                >
                                    {linkDetails?.icon} {linkDetails?.label}
                                </a>
                            ) : (
                                <button disabled className="w-full px-4 py-3 bg-slate-100 text-slate-400 text-sm font-bold rounded-xl cursor-not-allowed text-center">
                                  Coming Soon
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            );
        })}
      </div>
    </div>
  );
};
