import { Symptom } from "./symptom.type";

export type TriageFormValues = {
  age: string;
  gender: "male" | "female" | null;
  symptoms: Symptom[];
};
