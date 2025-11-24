import React, { useRef, useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

// EmailJS Credentials
const SERVICE_ID = 'service_jlue38b';
const TEMPLATE_ID = 'template_0e9z7yo';
const PUBLIC_KEY = 'rEXFTzcQG6_VryeWp';

export const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Form Input State for controlled inputs
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: ''
  });

  // Profile State
  const [contactInfo, setContactInfo] = useState({
    email: 'hello@ba-portfolio.com',
    phone: '+1 (555) 123-4567',
    location: 'Ho Chi Minh City, Vietnam',
    linkedin: '#',
    github: '#'
  });

  // Fetch contact info from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data } = await supabase.from('profile').select('*').single();
        if (data) {
          setContactInfo({
            email: data.email || 'hello@ba-portfolio.com',
            phone: data.phone || '+84 123 456 789',
            location: data.location || 'Ho Chi Minh City, Vietnam',
            linkedin: data.linkedin_url || '#',
            github: data.github_url || '#'
          });
        }
      } catch (e) {
        console.error("Error fetching contact info:", e);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.current) return;

    setLoading(true);
    setStatus('idle');

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
        console.log(result.text);
        setLoading(false);
        setStatus('success');
        // Reset form data
        setFormData({ user_name: '', user_email: '', message: '' });
        
        // Clear success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      }, (error) => {
        console.log(error.text);
        setLoading(false);
        setStatus('error');
      });
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
      {/* Background decoration - Teal Theme */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600 rounded-full blur-[128px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-600 rounded-full blur-[100px] opacity-10 translate-y-1/3 -translate-x-1/4"></div>

      <div className="grid md:grid-cols-2 gap-12 relative z-10">
        {/* Left Column: Contact Info */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's Connect!</h2>
          <p className="text-slate-300 mb-8 text-lg">
            I'm currently looking for full-time Business Analyst opportunities. 
            If you have a role that matches my skills, or just want to chat about product development, feel free to reach out.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
               <div className="bg-slate-800 p-3 rounded-lg text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                 <Mail size={24} />
               </div>
               <div>
                 <div className="text-sm text-slate-400">Email</div>
                 <div className="font-medium">{contactInfo.email}</div>
               </div>
            </div>
            
            <div className="flex items-center gap-4 group">
               <div className="bg-slate-800 p-3 rounded-lg text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                 <Phone size={24} />
               </div>
               <div>
                 <div className="text-sm text-slate-400">Phone</div>
                 <div className="font-medium">{contactInfo.phone}</div>
               </div>
            </div>

            <div className="flex items-center gap-4 group">
               <div className="bg-slate-800 p-3 rounded-lg text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                 <MapPin size={24} />
               </div>
               <div>
                 <div className="text-sm text-slate-400">Location</div>
                 <div className="font-medium">{contactInfo.location}</div>
               </div>
            </div>
          </div>

          <div className="mt-12">
            <h4 className="font-semibold mb-4 text-slate-300">Social Profiles</h4>
            <div className="flex gap-4">
                {contactInfo.linkedin !== '#' && (
                  <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 rounded-lg hover:bg-teal-600 text-slate-300 hover:text-white transition-all transform hover:-translate-y-1">
                      <Linkedin size={24} />
                  </a>
                )}
                {contactInfo.github !== '#' && (
                  <a href={contactInfo.github} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-all transform hover:-translate-y-1">
                      <Github size={24} />
                  </a>
                )}
            </div>
          </div>
        </div>

        {/* Right Column: Email Form */}
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          <form ref={form} onSubmit={sendEmail} className="space-y-4">
             {/* Hidden fields for advanced EmailJS configuration */}
             {/* 1. Set the Subject of the email to be the sender's email + name */}
             <input 
                type="hidden" 
                name="subject" 
                value={`Portfolio Message from: ${formData.user_email} (${formData.user_name})`} 
             />
             {/* 2. Set Reply-To to the sender's email so you can hit Reply in Gmail directly */}
             <input 
                type="hidden" 
                name="reply_to" 
                value={formData.user_email} 
             />

             <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                <input 
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500 transition-colors text-white"
                  placeholder="John Doe"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500 transition-colors text-white"
                  placeholder="john@example.com"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500 transition-colors text-white"
                  placeholder="I'd like to discuss a job opportunity..."
                />
             </div>
             
             <button 
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-lg transition-all transform hover:translate-y-[-2px] shadow-lg shadow-teal-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
             >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
             </button>

             <AnimatePresence>
               {status === 'success' && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                   className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 flex items-center gap-3"
                 >
                   <CheckCircle size={20} />
                   <span>Message sent successfully! I'll get back to you soon.</span>
                 </motion.div>
               )}
               {status === 'error' && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                   className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 flex items-center gap-3"
                 >
                   <AlertCircle size={20} />
                   <span>Failed to send message. Please try again or email me directly.</span>
                 </motion.div>
               )}
             </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
};