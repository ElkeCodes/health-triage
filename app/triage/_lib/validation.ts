import type { Symptom } from "./triage-form-values";

const triageValidation = {
  age: {
    required: "Gelieve een geldige leeftijd in te vullen.",
    validate: (value: string) => {
      const age = Number(value);

      if (!value.trim() || Number.isNaN(age) || age < 0) {
        return "Gelieve een geldige leeftijd in te vullen.";
      }

      return true;
    },
  },
  gender: {
    required: "Selecteer het geboortegeslacht.",
  },
  symptoms: {
    validate: (value: Symptom[]) =>
      value.length > 0 || "Gelieve minstens één symptoom te selecteren.",
  },
};

export default triageValidation;
