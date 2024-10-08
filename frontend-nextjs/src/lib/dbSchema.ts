export interface SubjectFields {
  _id: string;
  type?: string;
  subjectName: string;
  subjectCode: string;
  level: string;
  points: string;
  studyPeriod: string[];
  coordinator: object;
}
