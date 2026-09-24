export type TriageFormValues = {
  age: string;
  gender: "male" | "female" | null;
  symptoms: string[];
  urgency: "mild" | "moderate" | "severe";
};
