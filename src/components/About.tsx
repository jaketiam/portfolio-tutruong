import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Target } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface EducationItem {
  id: string;
  title: string;
  organization: string;
  start_date: string;
  end_date: string;
  description: string;
}

// Start empty to wait for DB data
const defaultEducation: EducationItem[] = [];

export const About: React.FC = () => {
  const [education, setEducation] = useState<EducationItem[]>(defaultEducation);

  useEffect(() => {
    const fetchEducation = async () => {
      if (!isSupabaseConfigured()) return;
      
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('type', 'education')
          .order('end_date', { ascending: false });

        if (data && data.length > 0 && !error) {
          setEducation(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEducation();
  }, []);

  return (
    <div className="relative">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About Me</h2>
        <div className="w-16 h-1 bg-teal-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Education Journey</h3>
          </div>
          
          <div className="border-l-2 border-slate-200 ml-3 pl-8 pb-2 relative space-y-10 min-h-[100px]">
            {education.length === 0 && (
               <div className="text-slate-400 text-sm italic">Loading education details...</div>
            )}
            {education.map((edu, index) => (
              <div key={edu.id} className="relative">
                <span className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm ${index === 0 ? 'bg-teal-500' : 'bg-slate-300'}`}></span>
                <h4 className="text-lg font-bold text-slate-900">{edu.title}</h4>
                <p className="text-teal-600 font-medium text-sm">{edu.start_date} - {edu.end_date}</p>
                <p className="text-slate-600 mt-2 font-semibold">{edu.organization}</p>
                <div className="text-slate-500 text-sm mt-3 leading-relaxed">
                  {edu.description.split(/(?:\\n|\r\n|\r|\n)/g).map((line, i) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return null;

                    // Check if line starts with bullet characters
                    const isBullet = /^[•\-*]/.test(trimmedLine);
                    const content = trimmedLine.replace(/^[•\-*]\s*/, '').trim();
                    
                    if (isBullet) {
                       return (
                         <div key={i} className="flex items-start gap-2 mb-1.5">
                           <span className="mt-2 w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                           <span className="text-slate-600">{content}</span>
                         </div>
                       );
                    }

                    // Normal paragraph
                    return <p key={i} className="mb-1 min-h-[1rem]">{content}</p>
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bio / My Approach */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="bg-teal-50/50 p-8 rounded-2xl border border-teal-100/50">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                 <Target size={20} />
               </div>
               <h3 className="text-xl font-bold text-slate-800">My Mission</h3>
             </div>
             <p className="text-slate-600 leading-relaxed">
               As a Business Analyst, my goal is to simplify complex business problems. I believe that effective analysis isn't just about documentation—it's about creating shared understanding between stakeholders and development teams to build products that truly deliver value.
             </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg">
                 <BookOpen size={20} />
               </div>
               <h3 className="text-xl font-bold text-slate-800">Continuous Learning</h3>
             </div>
             <p className="text-slate-600 leading-relaxed">
               Even as a fresh graduate, I am committed to continuous improvement. I actively follow industry trends in Data Analytics, Agile methodology, and Product Management to ensure my skills remain relevant and sharp.
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};