export type SymptomFollowUpQuestion = {
  questionKey: string;
  symptomName: string;
  question: string;
  helperText: string;
  options: string[];
  nextQuestion?: (
    selectedAnswers: string[],
  ) => SymptomFollowUpQuestion | null;
};

type FollowUpRule = {
  pattern: RegExp;
  build: (symptomName: string) => SymptomFollowUpQuestion;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function createQuestionKey(symptomName: string, key: string) {
  return `${slugify(symptomName)}-${key}`;
}

const onsetOptions = [
  "Plotseling begonnen",
  "Geleidelijk begonnen",
  "Komt en gaat",
  "Wordt erger",
  "Niet zeker",
];

const durationOptions = [
  "Minder dan een uur",
  "Enkele uren",
  "Vandaag begonnen",
  "Enkele dagen",
  "Langer dan een week",
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

function createQuestion(
  question: Omit<SymptomFollowUpQuestion, "nextQuestion"> & {
    nextQuestion?: SymptomFollowUpQuestion["nextQuestion"];
  },
): SymptomFollowUpQuestion {
  return question;
}

function createTimingFollowUp(
  symptomName: string,
  questionKey: string,
  question: string,
): SymptomFollowUpQuestion {
  return createQuestion({
    questionKey,
    symptomName,
    question,
    helperText:
      "Kies een antwoord dat aangeeft hoelang de klacht speelt of hoe snel deze opkwam.",
    options: durationOptions,
  });
}

const followUpRules: FollowUpRule[] = [
  {
    pattern: /hoest|benauwd|adem|long|piep/i,
    build: (symptomName) =>
      createQuestion({
        questionKey: createQuestionKey(symptomName, "breathing-clarification"),
        symptomName,
        question: "Welke ademhalingsklacht past het best?",
        helperText:
          "Kies een optie die het symptoom specifieker maakt of een bekende klacht uit de lijst.",
        options: breathingOptions,
        nextQuestion: () =>
          createTimingFollowUp(
            symptomName,
            createQuestionKey(symptomName, "breathing-timing"),
            "Hoe lang speelt dit al?",
          ),
      }),
  },
  {
    pattern: /buik|maag|darm|slik|braken|ontlasting/i,
    build: (symptomName) =>
      createQuestion({
        questionKey: createQuestionKey(symptomName, "digestive-clarification"),
        symptomName,
        question: "Welke buik- of spijsverteringsklacht past het best?",
        helperText:
          "Deze vraag helpt om het symptoom te verfijnen met een bekende klacht of een omschrijving.",
        options: digestiveOptions,
        nextQuestion: () =>
          createQuestion({
            questionKey: createQuestionKey(symptomName, "digestive-location"),
            symptomName,
            question: "Waar zit de klacht het meest?",
            helperText:
              "Gebruik dit als extra stap om de klacht nog specifieker te maken.",
            options: locationOptions,
          }),
      }),
  },
  {
    pattern: /hoofdpijn|duizelig|tintelingen|gevoelloos|spierzwakte|verward|bewustzijn|spraak/i,
    build: (symptomName) =>
      createQuestion({
        questionKey: createQuestionKey(symptomName, "neurologic-clarification"),
        symptomName,
        question: "Welke neurologische omschrijving past het best?",
        helperText:
          "Kies de beschrijving die het beste aangeeft hoe het symptoom zich uit.",
        options: neuroOptions,
        nextQuestion: () =>
          createTimingFollowUp(
            symptomName,
            createQuestionKey(symptomName, "neurologic-timing"),
            "Wanneer merkte u dit voor het eerst?",
          ),
      }),
  },
  {
    pattern: /uitslag|jeuk|huid|brandwond|wond|acne|nagel|haaruitval/i,
    build: (symptomName) =>
      createQuestion({
        questionKey: createQuestionKey(symptomName, "skin-clarification"),
        symptomName,
        question: "Welke huidklacht of omschrijving past het best?",
        helperText:
          "Kies een optie die het zichtbare patroon of de uitbreiding van de klacht beschrijft.",
        options: skinOptions,
        nextQuestion: () =>
          createQuestion({
            questionKey: createQuestionKey(symptomName, "skin-location"),
            symptomName,
            question: "Waar op de huid zit het het meest?",
            helperText:
              "Deze extra stap helpt om de klacht verder te localiseren.",
            options: locationOptions,
          }),
      }),
  },
  {
    pattern: /koorts|infectie|griep|verkoudheid|lymfeklieren/i,
    build: (symptomName) =>
      createQuestion({
        questionKey: createQuestionKey(symptomName, "infection-clarification"),
        symptomName,
        question: "Welke begeleidende infectieklacht past het best?",
        helperText:
          "Deze antwoorden gebruiken bekende klachten uit de triagelijst om het beeld te verscherpen.",
        options: infectionOptions,
        nextQuestion: () =>
          createTimingFollowUp(
            symptomName,
            createQuestionKey(symptomName, "infection-timing"),
            "Hoe lang heeft u hier al last van?",
          ),
      }),
  },
  {
    pattern: /pijn|zwaar|druk|brandend|kramp/i,
    build: (symptomName) =>
      createQuestion({
        questionKey: createQuestionKey(symptomName, "pain-clarification"),
        symptomName,
        question: "Hoe voelt de klacht het meest aan?",
        helperText:
          "Gebruik dit om een pijnklacht verder te typeren zonder vrije tekst in te vullen.",
        options: painOptions,
        nextQuestion: () =>
          createQuestion({
            questionKey: createQuestionKey(symptomName, "pain-location"),
            symptomName,
            question: "Waar voelt u de pijn het meest?",
            helperText:
              "Deze vervolgvraag helpt om de pijnklacht extra te lokaliseren.",
            options: locationOptions,
          }),
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
    questionKey: createQuestionKey(normalized, "general-clarification"),
    symptomName: normalized,
    question: "Welke omschrijving past het best bij dit symptoom?",
    helperText:
      "Kies een antwoord dat het symptoom specifieker maakt of de duur/het verloop verduidelijkt.",
    options: [...locationOptions, ...onsetOptions],
    nextQuestion: () =>
      createQuestion({
        questionKey: createQuestionKey(normalized, "general-timing"),
        symptomName: normalized,
        question: "Hoe lang speelt dit al?",
        helperText:
          "Als u al een omschrijving heeft gekozen, helpt deze stap om het verloop verder te duiden.",
        options: durationOptions,
      }),
  };
}

export function getNextSymptomFollowUp(
  question: SymptomFollowUpQuestion,
  selectedAnswers: string[],
): SymptomFollowUpQuestion | null {
  if (!selectedAnswers.length || !question.nextQuestion) {
    return null;
  }

  return question.nextQuestion(selectedAnswers);
}

export function buildSymptomFollowUpChain(
  symptomName: string,
  answersByQuestionKey: Record<string, string[]>,
): SymptomFollowUpQuestion[] {
  const chain: SymptomFollowUpQuestion[] = [];
  const visited = new Set<string>();
  let currentQuestion: SymptomFollowUpQuestion | null = getSymptomFollowUp(
    symptomName,
  );

  while (currentQuestion && !visited.has(currentQuestion.questionKey)) {
    chain.push(currentQuestion);
    visited.add(currentQuestion.questionKey);

    const selectedAnswers =
      answersByQuestionKey[currentQuestion.questionKey] ?? [];

    currentQuestion = getNextSymptomFollowUp(currentQuestion, selectedAnswers);
  }

  return chain;
}
