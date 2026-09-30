import { Symptom } from "./symptom.type";
import type { TriageQuestion } from "./triage-question.type";

export type TriageFormValues = {
  age: string;
  gender: "male" | "female" | null;
  symptoms: Symptom[];
  questions: TriageQuestion[];
};
