export interface Subject {
  _id: string;
  header: string;
  subjectName: string;
  subjectCode: string;
  level: string;
  points: string;
  studyPeriod: string[];
  coordinator: object;
  prerequisteError: boolean;
  semesterError: boolean;
}

export interface ProgressionItem {
  stats: string;
  fulfilled: boolean;
}

export interface ProgressionGroup {
  level1?: ProgressionItem;
  level2?: ProgressionItem;
  level3?: ProgressionItem;
}

export interface Progressions {
  overall: ProgressionGroup;
  discipline: ProgressionGroup;
  breadth: ProgressionGroup;
  degreeProgression: ProgressionGroup;
  // {
  //   "overall": {
  //       "level1": {
  //           "stats": "0 / 125(max) Credit Points of Level 1 Subject",
  //           "fulfilled": true
  //       }
  //   },
  //   "discipline": {
  //       "level1": {
  //           "stats": "0 / 62.5(min) Credit Points of Level 1 Discipline Subject",
  //           "fulfilled": false
  //       },
  //       "level2": {
  //           "stats": "0 / 62.5(min) Credit Points of Level 2 Discipline Subject",
  //           "fulfilled": false
  //       },
  //       "level3": {
  //           "stats": "0 / 75(min) Credit Points of Level 3 Discipline Subject",
  //           "fulfilled": false
  //       }
  //   },
  //   "breadth": {
  //       "level1": {
  //           "stats": "0 / 25(max) Credit Points of Level 1 Breadth Subject",
  //           "fulfilled": true
  //       }
  //   },
  //   "degreeProgression": {}
}
