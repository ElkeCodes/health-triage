import { TriageWizard } from "@/app/triage/_components/triage-wizard";
import {
  symptomOptions,
  mostPopularSymptoms,
} from "@/app/triage/_lib/symptom-options";

export default function TriagePage() {
  return (
    <TriageWizard
      symptomOptions={symptomOptions}
      mostPopularSymptoms={mostPopularSymptoms}
    />
  );
}
