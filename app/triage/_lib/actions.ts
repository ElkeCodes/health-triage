"use server";

import prisma from "@/lib/database";
import { suggestSymptoms } from "./symptom-suggestion.agent";
import { suggestSpeciality } from "./suggest-speciality";
import {
  getTriageUrgency,
  getNextStep,
  getConsultationType,
} from "./triage-urgency";
import type { Symptom } from "../_models/symptom.type";
import type { TriagePayload } from "./triage-schema";
import { triagePayloadSchema } from "./triage-schema";

export async function createTriage(input: TriagePayload) {
  const values = triagePayloadSchema.parse(input);

  const urgency = getTriageUrgency(values.symptoms);
  const suggestedSpeciality = suggestSpeciality(values.symptoms);

  await prisma.triage.create({
    data: {
      age: values.age,
      gender: values.gender,
      symptoms: values.symptoms.map((symptom) => symptom.name),
      urgency,
      pathway: suggestedSpeciality.speciality.naam,
      next: getNextStep(urgency),
      consultationType: getConsultationType(urgency),
      questions: {
        create: values.questions.map((question) => ({
          symptomName: question.symptomName,
          questionKey: question.questionKey,
          questionText: question.questionText,
          answerValues: question.answerValues,
          options: question.options,
          answeredAt: question.answerValues.length ? new Date() : null,
        })),
      },
    },
  });
}

export async function getSymptomSuggestions(input: {
  selectedSymptoms: string[];
  searchValue: string;
  followUpContext?: string[];
}): Promise<Symptom[]> {
  return suggestSymptoms(input);
}
