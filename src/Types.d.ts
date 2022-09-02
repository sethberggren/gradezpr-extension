type ParsedGrades = {
  name: string;
  grade: number;
};

type ParsedGradesStorage = {
  parsedGrades: {
    name: string;
    grade: number;
  }[];
};

type Accordion = {
  container: HTMLDivElement;
  controller: HTMLButtonElement;
  content: HTMLElement;
  expanded: boolean;
};

type ReducerArgs = {
  type: string;
  payload: any;
};

type Reducer<K, T extends ReducerArgs> = (init: K, action: T) => K;

type BlankGradesForm = {
  blankGradesFill: number | undefined;
  markAsMissingCheckbox: boolean;
};

type BlankGradesReducerAction =
  | { type: "markAsMissingCheckbox"; payload: boolean }
  | { type: "blankGradesFill"; payload: number };

type SpecialMarksOption =
  | "Missing"
  | "Collected"
  | "Late"
  | "Incomplete"
  | "Exempt"
  | "Absent";

type SpecialMarks = {
  grade: number;
  index: number;
  specialMarkOption: SpecialMarksOption;
};

type SpecialMarksAction =
  | {
      type: "add";
      payload: SpecialMarks;
    }
  | {
      type: "remove";
      payload: number;
    }
  | {
      type: "update";
      payload: { index: number; update: SpecialMarks };
    };

type FillSpeedForm = {
  fillSpeed: number;
};

type FillSpeedActions = {
  type: "update";
  payload: number;
};

type StudentGrade = {
  /**
   * @name : name in FirstName LastName format
   * @grade : student's raw score, calculated as points out of 100.
   */
  name: string;
  grade: number;
};

type StoredGrades = {
  parsedGrades: StudentGrade[];
};

type GradeCurveForm = {
  curveGradesCheckbox: boolean;
  minGradeCurve: number | undefined;
  maxGradeCurve: number | undefined;
};

type GradeCurveAction =
  | {
      type: "setCurveGradesCheckbox";
      payload: boolean;
    }
  | { type: "setMinGradeCurve"; payload: number }
  | { type: "setMaxGradeCurve"; payload: number };
