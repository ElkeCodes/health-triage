export type TriageFormValues = {
  age: string;
  gender: "male" | "female" | null;
  symptoms: Symptom[];
  urgency: "mild" | "moderate" | "severe";
};

export type Symptom = {
  name: string;
  urgency: number;
};
