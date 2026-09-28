import type { Symptom } from "./triage-form-values";

export type TriageUrgency = "routine" | "urgent" | "emergency";

export function getTriageUrgency(symptoms: Symptom[]): TriageUrgency {
  const highestUrgency = symptoms.reduce(
    (max, symptom) => Math.max(max, symptom.urgency),
    0,
  );

  if (highestUrgency >= 3) {
    return "emergency";
  }

  if (highestUrgency >= 2) {
    return "urgent";
  }

  return "routine";
}

export function getTriageUrgencyLabel(urgency: TriageUrgency) {
  return urgency === "emergency"
    ? "Emergency"
    : urgency === "urgent"
      ? "Urgent"
      : "Routine";
}

export function getNextStep(urgency: TriageUrgency) {
  return urgency === "emergency"
    ? "Neem onmiddellijk contact op met de spoedhulp."
    : urgency === "urgent"
      ? "Plan zo snel mogelijk een consult."
      : "Een gewone afspraak is meestal voldoende.";
}

export function getConsultationType(urgency: TriageUrgency) {
  return urgency === "emergency"
    ? "Spoedconsult"
    : urgency === "urgent"
      ? "Versneld consult"
      : "Regulier consult";
}
