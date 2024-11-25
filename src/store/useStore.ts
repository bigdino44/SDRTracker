import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { formatDistanceToNow } from 'date-fns';
import { QualificationData, LeaderboardEntry, UserProgress } from '../types';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'qualification' | 'demo' | 'follow-up';
  company: string;
}

interface Store {
  qualifications: QualificationData[];
  userProgress: UserProgress;
  meetings: Meeting[];
  addQualification: (qualification: Omit<QualificationData, 'date'>) => void;
  updateProgress: (moduleId: string, lessonId: string) => void;
  getLeaderboard: () => LeaderboardEntry[];
  addMeeting: (meeting: Meeting) => void;
  removeMeeting: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      qualifications: [],
      meetings: [],
      userProgress: {
        points: 0,
        completedLessons: new Set(),
        level: 'Junior Qualifier',
        dailyStreak: 0,
        lastActive: new Date().toISOString(),
      },

      addQualification: (qualification) => {
        const newQualification = {
          ...qualification,
          id: Date.now().toString(),
          date: new Date().toISOString(),
          points: qualification.status === 'Qualified' ? 100 : 
                 qualification.status === 'Disqualified' ? 25 : 50,
        };

        set((state) => ({
          qualifications: [newQualification, ...state.qualifications],
          userProgress: {
            ...state.userProgress,
            points: state.userProgress.points + newQualification.points,
          },
        }));
      },

      updateProgress: (moduleId, lessonId) => {
        set((state) => {
          const lessonKey = `${moduleId}-${lessonId}`;
          const completedLessons = new Set(state.userProgress.completedLessons);
          
          if (!completedLessons.has(lessonKey)) {
            completedLessons.add(lessonKey);
            return {
              userProgress: {
                ...state.userProgress,
                points: state.userProgress.points + 50,
                completedLessons,
              },
            };
          }
          return state;
        });
      },

      getLeaderboard: () => {
        const { qualifications, userProgress } = get();
        const conversionRate = qualifications.length > 0
          ? (qualifications.filter(q => q.status === 'Qualified').length / qualifications.length * 100).toFixed(0)
          : '0';

        return [
          { rank: 1, name: 'Sarah Johnson', points: 2850, qualifications: 45, conversion: '92%' },
          { rank: 2, name: 'Michael Chen', points: 2720, qualifications: 42, conversion: '88%' },
          { rank: 3, name: 'Emily Rodriguez', points: 2680, qualifications: 40, conversion: '85%' },
          { rank: 4, name: 'Current User', points: userProgress.points, qualifications: qualifications.length, conversion: `${conversionRate}%` },
          { rank: 5, name: 'Rachel Thompson', points: 2490, qualifications: 37, conversion: '80%' },
        ].sort((a, b) => b.points - a.points)
         .map((entry, index) => ({ ...entry, rank: index + 1 }));
      },

      addMeeting: (meeting) => {
        set((state) => ({
          meetings: [...state.meetings, meeting],
        }));
      },

      removeMeeting: (id) => {
        set((state) => ({
          meetings: state.meetings.filter((meeting) => meeting.id !== id),
        }));
      },
    }),
    {
      name: 'sdr-qualification-storage',
    }
  )
);