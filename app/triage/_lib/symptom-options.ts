import { SPECIALITIES } from "./specialities";

export const symptomOptions: string[] = [
  ...new Set(SPECIALITIES.flatMap((speciality) => speciality.symptomen)),
];
