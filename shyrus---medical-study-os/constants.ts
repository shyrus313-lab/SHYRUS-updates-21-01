
import { Subject, UserProfile, Quest, LongTermGoal, HospitalTask } from './types';

export const MEDICAL_SUBJECTS: string[] = [
  'Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology',
  'Microbiology', 'PSM', 'FMT', 'ENT', 'Ophthalmology', 'Medicine',
  'Surgery', 'Orthopedics', 'OBG', 'Pediatrics', 'Psychiatry',
  'Radiology', 'Anesthesia', 'Dermatology'
];

export const INITIAL_SUBJECTS: Subject[] = MEDICAL_SUBJECTS.map((name, index) => ({
  id: `subj-${index}`,
  name,
  coverage: 0,
  priority: 'Medium',
  revisionCount: 0,
  status: 'Active',
  topics: [] // Wiped topics for manual entry
}));

export const INITIAL_PROFILE: UserProfile = {
  name: 'OPERATOR',
  exam: 'FMGE',
  examDate: new Date(new Date().getFullYear(), new Date().getMonth() + 6, 1).toISOString().split('T')[0],
  level: 1,
  xp: 0,
  maxXp: 1000,
  focusRating: 0,
  disciplineRating: 0,
  consistency: 0,
  streak: 0,
  medals: []
};

export const INITIAL_QUESTS: Quest[] = []; // Purged

export const INITIAL_HOSPITAL_TASKS: HospitalTask[] = []; // Purged

export const INITIAL_LONG_TERM_GOALS: LongTermGoal[] = []; // Purged
