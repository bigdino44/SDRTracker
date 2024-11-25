export interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface Question {
  category: string;
  question: string;
  options: string[];
  points: number[];
}

export interface Lesson {
  id: string;
  name: string;
  duration: string;
  completed: boolean;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  lessons: Lesson[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  qualifications: number;
  conversion: string;
}

export interface QualificationData {
  id: string;
  company: string;
  status: 'Qualified' | 'In Progress' | 'Disqualified';
  date: string;
  points: number;
  score: {
    businessFit: number;
    capability: number;
    engagement: number;
    total: number;
    multiplier: number;
  };
  notes?: string;
}

export interface CriterionData {
  name: string;
  score: number;
}

export interface UserProgress {
  points: number;
  completedLessons: Set<string>;
  level: string;
  dailyStreak: number;
  lastActive: string;
}

export interface LeadScore {
  businessFit: number;
  capability: number;
  engagement: number;
  total: number;
  multiplier: number;
}