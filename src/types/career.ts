export interface CareerFormValues {
  age: number | null;
  education: string;
  englishLevel: string;
  internationalExperience: string;
  mainGoal: string;
  personalityStyle: string;
  personalityPreference: string;
  learningFormat: string;
  personalityInterest: string;
  workEnvironment: string;
  studyHoursPerDay: string;
  studyAvailability: string;
  mainChallenge: string;
  routineDuration: string;
  interestArea: string;
  targetProfession: string;
  coursePreference: string;
  financialCondition: string;
  preferredCountries: string[];
}

export type CareerQuestionKey = keyof CareerFormValues;

export type ArrayQuestionField = {
  [K in CareerQuestionKey]: CareerFormValues[K] extends string[] ? K : never;
}[CareerQuestionKey];

export type NonArrayQuestionField = Exclude<CareerQuestionKey, ArrayQuestionField>;

export type CareerQuestionType =
  | "text"
  | "number"
  | "single-choice"
  | "multi-choice";

export interface CareerStep {
  id: string;
  title: string;
  subtitle: string;
}

export interface CareerQuestion {
  id: CareerQuestionKey;
  stepId: CareerStep["id"];
  type: CareerQuestionType;
  title: string;
  helper: string;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
}

export interface ProfileSlice {
  name: string;
  value: number;
  color: string;
}

export interface UniversityProgram {
  university: string;
  program: string;
  country: string;
  duration: string;
}

export interface ScholarshipOption {
  name: string;
  country: string;
  coverage: string;
  fitReason: string;
}

export interface CareerResult {
  summary: string;
  profileChart: ProfileSlice[];
  suggestedCareers: string[];
  recommendedCountries: string[];
  universities: UniversityProgram[];
  scholarships: ScholarshipOption[];
  roadmap: string[];
  readinessLevel: number;
  topGaps: string[];
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}
