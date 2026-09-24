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