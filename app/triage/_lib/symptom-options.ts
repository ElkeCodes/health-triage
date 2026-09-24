import { SPECIALITIES } from "./specialities";
import type { Symptom } from "./triage-form-values";

export const symptomOptions: Symptom[] = Array.from(
  new Map(
    SPECIALITIES.flatMap((speciality) => speciality.symptoms).map((symptom) => [
      symptom.name,
      symptom,
    ]),
  ).values(),
);
