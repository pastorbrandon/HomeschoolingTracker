import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Child, Subject, Record, SchoolYear } from './types';

interface HomeSchoolDB extends DBSchema {
  children: {
    key: string;
    value: Child;
  };
  subjects: {
    key: string;
    value: Subject;
  };
  records: {
    key: string;
    value: Record;
    indexes: {
      'by-date': string;
      'by-child': string;
      'by-subject': string;
      'by-date-child': string;
    };
  };
  schoolYear: {
    key: string;
    value: SchoolYear;
  };
}

class Database {
  private db: IDBPDatabase<HomeSchoolDB> | null = null;

  async init() {
    if (this.db) return this.db;

    this.db = await openDB<HomeSchoolDB>('homeschool-tracker', 1, {
      upgrade(db) {
        // Children store
        const childrenStore = db.createObjectStore('children', { keyPath: 'id' });
        childrenStore.createIndex('by-order', 'order');

        // Subjects store
        const subjectsStore = db.createObjectStore('subjects', { keyPath: 'id' });
        subjectsStore.createIndex('by-order', 'order');

        // Records store
        const recordsStore = db.createObjectStore('records', { keyPath: 'id' });
        recordsStore.createIndex('by-date', 'date');
        recordsStore.createIndex('by-child', 'childId');
        recordsStore.createIndex('by-subject', 'subjectId');
        recordsStore.createIndex('by-date-child', ['date', 'childId']);

        // School year store
        db.createObjectStore('schoolYear', { keyPath: 'id' });
      },
    });

    // Initialize with default data if empty
    await this.initializeDefaults();

    return this.db;
  }

  private async initializeDefaults() {
    if (!this.db) return;

    // Check if children exist
    const childrenCount = await this.db.count('children');
    if (childrenCount === 0) {
      const defaultChildren: Child[] = [
        { id: 'child-a', name: 'Child A', order: 0 },
        { id: 'child-b', name: 'Child B', order: 1 },
        { id: 'child-c', name: 'Child C', order: 2 },
      ];

      for (const child of defaultChildren) {
        await this.db.add('children', child);
      }
    }

    // Check if subjects exist
    const subjectsCount = await this.db.count('subjects');
    if (subjectsCount === 0) {
      const defaultSubjects: Subject[] = [
        { id: 'math', name: 'Math', order: 0 },
        { id: 'reading', name: 'Reading', order: 1 },
        { id: 'writing', name: 'Writing', order: 2 },
        { id: 'science', name: 'Science', order: 3 },
        { id: 'history', name: 'History', order: 4 },
        { id: 'bible', name: 'Bible', order: 5 },
        { id: 'elective', name: 'Elective', order: 6 },
        { id: 'pe', name: 'PE', order: 7 },
      ];

      for (const subject of defaultSubjects) {
        await this.db.add('subjects', subject);
      }
    }

    // Check if school year exists
    const schoolYearCount = await this.db.count('schoolYear');
    if (schoolYearCount === 0) {
      const currentYear = new Date().getFullYear();
      const defaultSchoolYear: SchoolYear = {
        startDate: `${currentYear}-09-01`,
        endDate: `${currentYear + 1}-06-30`,
      };

      await this.db.add('schoolYear', { id: 'current', ...defaultSchoolYear });
    }
  }

  // Children operations
  async getChildren(): Promise<Child[]> {
    const db = await this.init();
    return db.getAll('children');
  }

  async addChild(child: Omit<Child, 'id'>): Promise<string> {
    const db = await this.init();
    const id = `child-${Date.now()}`;
    await db.add('children', { ...child, id });
    return id;
  }

  async updateChild(child: Child): Promise<void> {
    const db = await this.init();
    await db.put('children', child);
  }

  async deleteChild(id: string): Promise<void> {
    const db = await this.init();
    await db.delete('children', id);
    // Also delete all records for this child
    const records = await db.getAllFromIndex('records', 'by-child', id);
    for (const record of records) {
      await db.delete('records', record.id);
    }
  }

  // Subjects operations
  async getSubjects(): Promise<Subject[]> {
    const db = await this.init();
    return db.getAll('subjects');
  }

  async addSubject(subject: Omit<Subject, 'id'>): Promise<string> {
    const db = await this.init();
    const id = `subject-${Date.now()}`;
    await db.add('subjects', { ...subject, id });
    return id;
  }

  async updateSubject(subject: Subject): Promise<void> {
    const db = await this.init();
    await db.put('subjects', subject);
  }

  async deleteSubject(id: string): Promise<void> {
    const db = await this.init();
    await db.delete('subjects', id);
    // Also delete all records for this subject
    const records = await db.getAllFromIndex('records', 'by-subject', id);
    for (const record of records) {
      await db.delete('records', record.id);
    }
  }

  // Records operations
  async getRecordsByDate(date: string): Promise<Record[]> {
    const db = await this.init();
    return db.getAllFromIndex('records', 'by-date', date);
  }

  async getRecordsByDateRange(startDate: string, endDate: string): Promise<Record[]> {
    const db = await this.init();
    const allRecords = await db.getAll('records');
    return allRecords.filter(
      record => record.date >= startDate && record.date <= endDate
    );
  }

  async toggleRecord(date: string, childId: string, subjectId: string): Promise<void> {
    const db = await this.init();
    const recordId = `${date}-${childId}-${subjectId}`;
    
    try {
      const existingRecord = await db.get('records', recordId);
      if (existingRecord) {
        await db.delete('records', recordId);
      } else {
        await db.add('records', {
          id: recordId,
          date,
          childId,
          subjectId,
          completed: true,
        });
      }
    } catch (error) {
      // Record doesn't exist, create it
      await db.add('records', {
        id: recordId,
        date,
        childId,
        subjectId,
        completed: true,
      });
    }
  }

  async isRecordCompleted(date: string, childId: string, subjectId: string): Promise<boolean> {
    const db = await this.init();
    const recordId = `${date}-${childId}-${subjectId}`;
    const record = await db.get('records', recordId);
    return !!record;
  }

  // School year operations
  async getSchoolYear(): Promise<SchoolYear | null> {
    const db = await this.init();
    return db.get('schoolYear', 'current');
  }

  async updateSchoolYear(schoolYear: SchoolYear): Promise<void> {
    const db = await this.init();
    await db.put('schoolYear', { id: 'current', ...schoolYear });
  }

  // Utility operations
  async clearAllData(): Promise<void> {
    const db = await this.init();
    await db.clear('children');
    await db.clear('subjects');
    await db.clear('records');
    await db.clear('schoolYear');
    // Reinitialize defaults
    await this.initializeDefaults();
  }

  async getAttendanceSummary(startDate: string, endDate: string) {
    const records = await this.getRecordsByDateRange(startDate, endDate);
    const children = await this.getChildren();
    const subjects = await this.getSubjects();

    const summary: { [childId: string]: { [subjectId: string]: number } } = {};
    const attendanceDays: { [childId: string]: Set<string> } = {};

    // Initialize summary
    children.forEach(child => {
      summary[child.id] = {};
      subjects.forEach(subject => {
        summary[child.id][subject.id] = 0;
      });
      attendanceDays[child.id] = new Set();
    });

    // Process records
    records.forEach(record => {
      if (record.completed) {
        summary[record.childId][record.subjectId]++;
        attendanceDays[record.childId].add(record.date);
      }
    });

    return children.map(child => ({
      childId: child.id,
      childName: child.name,
      totalDays: attendanceDays[child.id].size,
      subjectTotals: summary[child.id],
    }));
  }
}

export const db = new Database();
