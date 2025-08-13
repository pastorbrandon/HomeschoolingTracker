export interface Child {
  id: string;
  name: string;
  order: number;
}

export interface Subject {
  id: string;
  name: string;
  order: number;
}

export interface Record {
  date: string;
  childId: string;
  subjectId: string;
  completed: boolean;
}

export interface SchoolYear {
  startDate: string;
  endDate: string;
}

export interface AttendanceSummary {
  childId: string;
  childName: string;
  totalDays: number;
  subjectTotals: { [subjectId: string]: number };
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
