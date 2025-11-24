export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  tools: string[];
  image: string;
  link?: string;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  icon?: string;
  type?: 'certification' | 'education' | 'volunteer' | 'work';
  subtype?: string; // 'Certification' | 'Award' | 'Academic' | 'Scholarship' | 'Extracurricular'
  image_url?: string;
}

export interface Skill {
  id?: string;
  name: string;
  level: number; // 0-100
  category: 'technical' | 'soft' | 'tool';
  description?: string;
  icon_name?: string;
}

export interface Profile {
  full_name: string;
  headline: string;
  short_bio: string;
  long_bio: string;
  avatar_url: string;
  resume_url?: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
}

export type SectionId = 'home' | 'about' | 'experience' | 'projects' | 'contact';