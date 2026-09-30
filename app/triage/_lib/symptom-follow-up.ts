export type SymptomFollowUpQuestion = {
  questionKey: string;
  symptomName: string;
  question: string;
  helperText: string;
  options: string[];
};

type FollowUpRule = {
  pattern: RegExp;
  build: (symptomName: string) => SymptomFollowUpQuestion;
};

const onsetOptions = [
  "Plotseling begonnen",
  "Geleidelijk begonnen",
  "Komt en gaat",
  "Wordt erger",
  "Niet zeker",
];

const locationOptions = [
  "Links",
  "Rechts",
  "Midden",
  "Overal",
  "Niet zeker",
];

const breathingOptions = [
  "Droge hoest",
  "Slijm ophoesten",
  "Piepende ademhaling",
  "Benauwdheid",
  "Bloed ophoesten",
];

const painOptions = [
  "Stekend",
  "Drukkend",
  "Brandend",
  "Krampend",
  "Niet zeker",
];

const skinOptions = [
  "Rood",
  "Jeukend",
  "Snel uitbreidend",
  "Plaatselijk",
  "Over het hele lichaam",
];

const neuroOptions = [
  "Duizeligheid",
  "Tintelingen",
  "Gevoelloosheid",
  "Spierzwakte",
  "Verwardheid",
];

const digestiveOptions = [
  "Buikpijn",
  "Opgeblazen gevoel",
  "Diarree of obstipatie",
  "Braken",
  "Moeilijk slikken",
];

const infectionOptions = [
  "Koorts",
  "Rillingen",
  "Aanhoudende klachten",
  "Opgezwollen lymfeklieren",
  "Reisgerelateerd",
];

const followUpRules: FollowUpRule[] = [
  {
    pattern: /hoest|benauwd|adem|long|piep/i,
    build: (symptomName) => ({
      questionKey: "breathing-clarification",
      symptomName,
      question: "Welke ademhalingsklacht past het best?",
      helperText:
        "Kies een optie die het symptoom specifieker maakt of een bekende klacht uit de lijst.",
      options: breathingOptions,
    }),
  },
  {
    pattern: /buik|maag|darm|slik|braken|ontlasting/i,
    build: (symptomName) => ({
      questionKey: "digestive-clarification",
      symptomName,
      question: "Welke buik- of spijsverteringsklacht past het best?",
      helperText:
        "Deze vraag helpt om het symptoom te verfijnen met een bekende klacht of een omschrijving.",
      options: digestiveOptions,
    }),
  },
  {
    pattern: /hoofdpijn|duizelig|tintelingen|gevoelloos|spierzwakte|verward|bewustzijn|spraak/i,
    build: (symptomName) => ({
      questionKey: "neurologic-clarification",
      symptomName,
      question: "Welke neurologische omschrijving past het best?",
      helperText:
        "Kies de beschrijving die het beste aangeeft hoe het symptoom zich uit.",
      options: neuroOptions,
    }),
  },
  {
    pattern: /uitslag|jeuk|huid|brandwond|wond|acne|nagel|haaruitval/i,
    build: (symptomName) => ({
      questionKey: "skin-clarification",
      symptomName,
      question: "Welke huidklacht of omschrijving past het best?",
      helperText:
        "Kies een optie die het zichtbare patroon of de uitbreiding van de klacht beschrijft.",
      options: skinOptions,
    }),
  },
  {
    pattern: /koorts|infectie|griep|verkoudheid|lymfeklieren/i,
    build: (symptomName) => ({
      questionKey: "infection-clarification",
      symptomName,
      question: "Welke begeleidende infectieklacht past het best?",
      helperText:
        "Deze antwoorden gebruiken bekende klachten uit de triagelijst om het beeld te verscherpen.",
      options: infectionOptions,
    }),
  },
  {
    pattern: /pijn|zwaar|druk|brandend|kramp/i,
    build: (symptomName) => ({
      questionKey: "pain-clarification",
      symptomName,
      question: "Hoe voelt de klacht het meest aan?",
      helperText:
        "Gebruik dit om een pijnklacht verder te typeren zonder vrije tekst in te vullen.",
      options: painOptions,
    }),
  },
];

export function getSymptomFollowUp(symptomName: string): SymptomFollowUpQuestion {
  const normalized = symptomName.trim();

  const rule = followUpRules.find((item) => item.pattern.test(normalized));

  if (rule) {
    return rule.build(normalized);
  }

  return {
    questionKey: "general-clarification",
    symptomName: normalized,
    question: "Welke omschrijving past het best bij dit symptoom?",
    helperText:
      "Kies een antwoord dat het symptoom specifieker maakt of de duur/het verloop verduidelijkt.",
    options: [...locationOptions, ...onsetOptions],
  };
}
