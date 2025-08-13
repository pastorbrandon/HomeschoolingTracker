import { create } from 'zustand';
import { Child, Subject, SchoolYear, AttendanceSummary } from './types';
import { db } from './db';

interface HomeSchoolStore {
  // State
  children: Child[];
  subjects: Subject[];
  schoolYear: SchoolYear | null;
  todayRecords: { [key: string]: boolean };
  attendanceSummary: AttendanceSummary[];
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  loadTodayRecords: (date: string) => Promise<void>;
  toggleRecord: (date: string, childId: string, subjectId: string) => Promise<void>;
  
  // Children management
  addChild: (name: string) => Promise<void>;
  updateChild: (child: Child) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
  
  // Subjects management
  addSubject: (name: string) => Promise<void>;
  updateSubject: (subject: Subject) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  
  // School year management
  updateSchoolYear: (schoolYear: SchoolYear) => Promise<void>;
  
  // Reports
  loadAttendanceSummary: (startDate: string, endDate: string) => Promise<void>;
  
  // Data management
  clearAllData: () => Promise<void>;
  
  // Utility
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useHomeSchoolStore = create<HomeSchoolStore>((set, get) => ({
  // Initial state
  children: [],
  subjects: [],
  schoolYear: null,
  todayRecords: {},
  attendanceSummary: [],
  isLoading: false,
  error: null,

  // Initialize store
  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const [children, subjects, schoolYear] = await Promise.all([
        db.getChildren(),
        db.getSubjects(),
        db.getSchoolYear(),
      ]);

      set({
        children: children.sort((a, b) => a.order - b.order),
        subjects: subjects.sort((a, b) => a.order - b.order),
        schoolYear,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to initialize', 
        isLoading: false 
      });
    }
  },

  // Load today's records
  loadTodayRecords: async (date: string) => {
    try {
      const records = await db.getRecordsByDate(date);
      const todayRecords: { [key: string]: boolean } = {};
      
      records.forEach(record => {
        const key = `${record.childId}-${record.subjectId}`;
        todayRecords[key] = record.completed;
      });

      set({ todayRecords });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load today\'s records' });
    }
  },

  // Toggle record
  toggleRecord: async (date: string, childId: string, subjectId: string) => {
    try {
      await db.toggleRecord(date, childId, subjectId);
      
      // Update local state
      const key = `${childId}-${subjectId}`;
      const currentState = get().todayRecords[key];
      set(state => ({
        todayRecords: {
          ...state.todayRecords,
          [key]: !currentState,
        },
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to toggle record' });
    }
  },

  // Children management
  addChild: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const children = get().children;
      const order = children.length;
      const id = await db.addChild({ name, order });
      
      set(state => ({
        children: [...state.children, { id, name, order }].sort((a, b) => a.order - b.order),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add child', 
        isLoading: false 
      });
    }
  },

  updateChild: async (child: Child) => {
    set({ isLoading: true, error: null });
    try {
      await db.updateChild(child);
      set(state => ({
        children: state.children.map(c => c.id === child.id ? child : c).sort((a, b) => a.order - b.order),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update child', 
        isLoading: false 
      });
    }
  },

  deleteChild: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await db.deleteChild(id);
      set(state => ({
        children: state.children.filter(c => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete child', 
        isLoading: false 
      });
    }
  },

  // Subjects management
  addSubject: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const subjects = get().subjects;
      const order = subjects.length;
      const id = await db.addSubject({ name, order });
      
      set(state => ({
        subjects: [...state.subjects, { id, name, order }].sort((a, b) => a.order - b.order),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add subject', 
        isLoading: false 
      });
    }
  },

  updateSubject: async (subject: Subject) => {
    set({ isLoading: true, error: null });
    try {
      await db.updateSubject(subject);
      set(state => ({
        subjects: state.subjects.map(s => s.id === subject.id ? subject : s).sort((a, b) => a.order - b.order),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update subject', 
        isLoading: false 
      });
    }
  },

  deleteSubject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await db.deleteSubject(id);
      set(state => ({
        subjects: state.subjects.filter(s => s.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete subject', 
        isLoading: false 
      });
    }
  },

  // School year management
  updateSchoolYear: async (schoolYear: SchoolYear) => {
    set({ isLoading: true, error: null });
    try {
      await db.updateSchoolYear(schoolYear);
      set({ schoolYear, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update school year', 
        isLoading: false 
      });
    }
  },

  // Load attendance summary
  loadAttendanceSummary: async (startDate: string, endDate: string) => {
    set({ isLoading: true, error: null });
    try {
      const summary = await db.getAttendanceSummary(startDate, endDate);
      set({ attendanceSummary: summary, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load attendance summary', 
        isLoading: false 
      });
    }
  },

  // Clear all data
  clearAllData: async () => {
    set({ isLoading: true, error: null });
    try {
      await db.clearAllData();
      const [children, subjects, schoolYear] = await Promise.all([
        db.getChildren(),
        db.getSubjects(),
        db.getSchoolYear(),
      ]);

      set({
        children: children.sort((a, b) => a.order - b.order),
        subjects: subjects.sort((a, b) => a.order - b.order),
        schoolYear,
        todayRecords: {},
        attendanceSummary: [],
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to clear data', 
        isLoading: false 
      });
    }
  },

  // Utility actions
  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
