import type { Symptom } from "../_models/symptom.type";
import { SPECIALITIES } from "./specialities";

export const symptomOptions: Symptom[] = Array.from(
  new Map(
    SPECIALITIES.flatMap((speciality) => speciality.symptoms).map((symptom) => [
      symptom.name,
      symptom,
    ]),
  ).values(),
).sort((a, b) => a.name.localeCompare(b.name));

export const symptomOptionsByName = new Map(
  symptomOptions.map((symptom) => [symptom.name, symptom] as const),
);

export const defaultSuggestedSymptoms: Symptom[] = [
  symptomOptions.find((symptom) => symptom.name === "Buikpijn"),
  symptomOptions.find(
    (symptom) => symptom.name === "Hevige of plotselinge hoofdpijn",
  ),
  symptomOptions.find((symptom) => symptom.name === "Keelpijn"),
  symptomOptions.find((symptom) => symptom.name === "Koorts"),
  symptomOptions.find((symptom) => symptom.name === "Verkoudheid"),
].filter(Boolean) as Symptom[];
