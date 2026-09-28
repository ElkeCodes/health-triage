import { SPECIALITIES } from "./specialities";
import type { Symptom } from "./triage-form-values";

export const symptomOptions: Symptom[] = Array.from(
  new Map(
    SPECIALITIES.flatMap((speciality) => speciality.symptoms).map((symptom) => [
      symptom.name,
      symptom,
    ]),
  ).values(),
).sort((a, b) => a.name.localeCompare(b.name));

export const mostPopularSymptoms: Symptom[] = [
  symptomOptions.find((symptom) => symptom.name === "Buikpijn"),
  symptomOptions.find(
    (symptom) => symptom.name === "Hevige of plotselinge hoofdpijn",
  ),
  symptomOptions.find((symptom) => symptom.name === "Keelpijn"),
  symptomOptions.find((symptom) => symptom.name === "Koorts"),
  symptomOptions.find((symptom) => symptom.name === "Verkoudheid"),
].filter(Boolean) as Symptom[];
