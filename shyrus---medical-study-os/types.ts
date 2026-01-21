
export type Priority = 'High' | 'Medium' | 'Low';

export interface Topic {
  id: string;
  title: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  difficulty: number; // 1-5
}

export interface QBankRecord {
  id: string;
  date: string;
  subject: string;
  topic: string;
  score: number;
  total: number;
  type: 'QBank' | 'PYQ';
}

export interface Subject {
  id: string;
  name: string;
  coverage: number; // 0-100
  priority: Priority;
  revisionCount: number;
  status: 'Locked' | 'Active' | 'Completed';
  lastStudied?: string;
  topics: Topic[];
}

export interface UserProfile {
  name: string;
  exam: string;
  examDate: string;
  level: number;
  xp: number;
  maxXp: number;
  focusRating: number;
  disciplineRating: number;
  consistency: number;
  streak: number;
  medals: string[]; 
  lastActivityDate?: string; // YYYY-MM-DD
}

export interface Quest {
  id: string;
  title: string;
  subject: string;
  duration: number; // minutes
  type: 'Main' | 'Side';
  completed: boolean;
  topicId?: string;
  dueTime?: string;
}

export interface HospitalTask {
  id: string;
  label: string;
  completed: boolean;
  category: 'Ward' | 'Lab' | 'Drug' | 'Round';
}

export interface ScheduleEntry {
  id: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  label: string;
  type: 'Study' | 'Hospital' | 'Rest' | 'Revision';
  subject?: string;
  lastNotified?: string; // YYYY-MM-DD
}

export interface FocusSession {
  id: string;
  startTime: number;
  duration: number; // minutes
  subject: string;
  completed: boolean;
}

export interface EDiaryEntry {
  id: string;
  date: string;
  content: string;
  mood: 'Exhausted' | 'Determined' | 'Anxious' | 'Victorious';
  shiftType: 'None' | 'Day' | 'Night' | 'Double';
}

export interface TacticalNotification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  type?: 'ALARM' | 'REVISION' | 'GENERAL' | 'SCHEDULE';
}

export interface DailyLog {
  id: string;
  date: string;
  subject: string;
  duration: number;
  rating: number;
}

export interface TacticalReminder {
  id: string;
  label: string;
  time: string; // HH:mm
  active: boolean;
  days: string[]; // ['Mon', 'Tue', ...] - used for recurring
  date?: string; // YYYY-MM-DD - used for one-time reminders
  lastTriggered?: string; // YYYY-MM-DD
}

export interface Reflection {
  id: string;
  date: string;
  planned: string;
  actual: string;
  distraction: 'None' | 'Phone' | 'Fatigue' | 'Anxiety' | 'Hospital' | 'Procrastination';
  insight: string;
  status: 'Success' | 'Compromised' | 'Critical';
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  mnemonic?: string;
}

export interface Annotation {
  id: string;
  page: number;
  type: 'Highlight' | 'Note';
  content?: string;
  color?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface LongTermGoal {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
  type: 'Milestone' | 'Revision';
}

export interface WeeklyGoal {
  id: string;
  weekStarting: string; // YYYY-MM-DD
  title: string;
  completed: boolean;
}

export interface PDFFile {
  id: string;
  name: string;
  uploadDate: string;
  subjectId: string;
  annotationsCount: number;
  flashcards?: Flashcard[];
  annotations?: Annotation[];
  originalUrl?: string;
}

export interface VolatileNode {
  id: string;
  subject: string;
  topic: string;
  criticality: 'High' | 'Critical';
  addedDate: string;
}

export interface AppState {
  profile: UserProfile;
  subjects: Subject[];
  quests: Quest[];
  hospitalLog: HospitalTask[];
  logs: DailyLog[];
  isHospitalMode: boolean;
  dutyDates: string[]; // YYYY-MM-DD
  longTermGoals: LongTermGoal[];
  weeklyGoals: WeeklyGoal[];
  todoList: { id: string; text: string; done: boolean }[];
  chatHistory: ChatMessage[];
  ventHistory: ChatMessage[];
  vaultFiles: PDFFile[];
  sessions: FocusSession[];
  reflections: Reflection[];
  reminders: TacticalReminder[];
  dailySchedule: ScheduleEntry[];
  eDiary: EDiaryEntry[];
  notifications: TacticalNotification[];
  qbankRecords: QBankRecord[];
  volatileNodes: VolatileNode[];
  trainingLevel: number;
  showTrainingOverlay: boolean;
  sanctuaryAssistantName: string;
  showMilestoneOverlay: number | null; 
}
