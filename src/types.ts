export type StepType = "start" | "phase_module" | "phase_eval" | "phase_project" | "finish";

export interface PathStep {
  id: string;
  label: string;
  type: StepType;
  description: string;
  whatYouWillLearn: string;
  practiceToRealize: string;
  evaluationCondition: string;
  whatItUnlocks: string;
  phaseId?: string;
  quizQuestions?: QuizQuestion[];
  projectTemplate?: {
    instructions: string;
    starterCode: string;
    solutionKeywords: string[];
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  type: "concept" | "logic_exercise" | "python_primer";
  content: string;
  codeSnippet?: string;
  expectedOutput?: string;
  expectedVariables?: { [key: string]: string | number };
  explanationOfGoal: string;
}

export interface Phase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badgeName: string;
  objectives: string[];
  challengeTitle: string;
  challengeDescription: string;
  lessons: Lesson[];
}
