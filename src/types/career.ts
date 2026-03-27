export interface CareerFormValues {
  age: number | null;
  education: string;
  currentlyWorking: string;
  workInGraduationArea: string;
  currentProfession: string;
  englishLevel: string;
  internationalExperience: string;
  mainGoal: string;
  personalityStyle: string;
  personalityPreference: string;
  learningFormat: string;
  personalityInterest: string;
  studyHoursPerDay: string;
  studyAvailability: string;
  mainChallenge: string;
  routineDuration: string;
  intendsCareerChange: string;
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
  | "textarea"
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
  maxLength?: number;
  options?: string[];
  min?: number;
  max?: number;
}

export interface PersonalityProfile {
  code: string;
  title: string;
  description: string;
  strengths: string[];
}

export interface CountryMatch {
  country: string;
  compatibility: number;
  reason: string;
}

export interface CareerResult {
  summary: string;
  personalityProfile: PersonalityProfile;
  countryMatches: CountryMatch[];
  readinessLevel: number;
}
