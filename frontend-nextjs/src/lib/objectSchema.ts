export interface Subject {
  _id: string;
  header: string;
  subjectName: string;
  subjectCode: string;
  level: string;
  points: string;
  studyPeriod: string[];
  coordinator: object;
}
