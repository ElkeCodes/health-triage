export type TriageFormValues = {
  age: string;
  gender: "male" | "female" | null;
  symptoms: Symptom[];
};

export type Symptom = {
  name: string;
  urgency: number;
};
