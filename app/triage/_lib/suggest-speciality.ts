import { GENERAL_PRACTICIONER, SPECIALITIES } from "./specialities";
import { Symptom } from "./triage-form-values";

export const suggestSpeciality = (symptoms: Symptom[]) => {
  const scoredSpecialities = SPECIALITIES.map((speciality, index) => {
    const matchedSymptoms = speciality.symptoms.filter((symptom) =>
      symptoms.some((selected) => selected.name === symptom.name),
    );

    return {
      speciality,
      matchedSymptoms,
      score: matchedSymptoms.length,
      index,
    };
  }).filter(({ score }) => score > 0);

  if (scoredSpecialities.length) {
    return scoredSpecialities.sort(
      (left, right) => right.score - left.score || left.index - right.index,
    )[0]!;
  }

  return {
    speciality: GENERAL_PRACTICIONER,
    matchedSymptoms: [],
    score: 0,
    index: -1,
  };
};
