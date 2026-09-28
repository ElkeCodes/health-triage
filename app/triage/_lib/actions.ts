"use server";

import prisma from "@/lib/database";
import { suggestSpeciality } from "./suggest-speciality";
import {
  getTriageUrgency,
  getNextStep,
  getConsultationType,
} from "./triage-urgency";
import type { CreateTriageInput } from "./triage-schema";
import { createTriageInputSchema } from "./triage-schema";

export async function createTriage(input: CreateTriageInput) {
  const values = createTriageInputSchema.parse(input);

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
    },
  });
}
