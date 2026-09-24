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
    validate: (value: string[]) =>
      value.length > 0 || "Gelieve minstens één symptoom te selecteren.",
  },
  urgency: {
    required: "Selecteer de urgentie.",
  },
};

export default triageValidation;
