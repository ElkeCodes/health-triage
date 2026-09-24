import * as React from "react";
import type { Symptom } from "../_lib/triage-form-values";
import { Stethoscope } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GENERAL_PRACTICIONER, SPECIALITIES } from "../_lib/specialities";
import { TriageFormValues } from "../_lib/triage-form-values";
import {
  getTriageUrgency,
  getTriageUrgencyLabel,
} from "../_lib/triage-urgency";
import { cn } from "@/lib/utils";

const urgencyStyles = {
  routine: {
    panel: "border-emerald-200 bg-emerald-50/80 text-emerald-950",
    label: "text-emerald-700",
  },
  urgent: {
    panel: "border-amber-200 bg-amber-50/80 text-amber-950",
    label: "text-amber-700",
  },
  emergency: {
    panel: "border-rose-200 bg-rose-50/80 text-rose-950",
    label: "text-rose-700",
  },
} as const;

function AssessmentStep() {
  const { control } = useFormContext<TriageFormValues>();
  const selectedSymptoms = useWatch({
    control,
    name: "symptoms",
    defaultValue: [],
  });
  const urgency = React.useMemo(
    () => getTriageUrgency(selectedSymptoms),
    [selectedSymptoms],
  );
  const urgencyStyle = urgencyStyles[urgency];
  const suggestedSpeciality = React.useMemo(() => {
    const scoredSpecialities = SPECIALITIES.map((speciality, index) => {
      const matchedSymptoms = speciality.symptoms.filter((symptom) =>
        selectedSymptoms.some((selected) => selected.name === symptom.name),
      );

      return {
        speciality,
        matchedSymptoms,
        score: matchedSymptoms.length,
        index,
      };
    }).filter(({ score }) => score > 0);

    if (scoredSpecialities.length) {
      return scoredSpecialities.sort(
        (left, right) => right.score - left.score || left.index - right.index,
      )[0]!;
    }

    return {
      speciality: GENERAL_PRACTICIONER,
      matchedSymptoms: [],
      score: 0,
      index: -1,
    };
  }, [selectedSymptoms]);

  return (
    <div className="grid gap-4">
      <Card
        className={cn("border-primary/20 bg-primary/5", urgencyStyle.panel)}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="size-5 text-primary" />
            Aanbevolen specialiteit
          </CardTitle>
          <CardDescription>
            Op basis van de gekozen symptomen zoeken we de beste specialiteit
            voor u.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 rounded-xl bg-background/80 p-4 ring-1 ring-border/60 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Aanbevolen
              </p>
              <p className="mt-1 text-lg font-semibold">
                {suggestedSpeciality.speciality.naam}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Match
              </p>
              <p className="mt-1 text-lg font-semibold">
                {suggestedSpeciality
                  ? `${suggestedSpeciality.score}/${selectedSymptoms.length || 0} symptomen`
                  : "0 symptomen"}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {(suggestedSpeciality.matchedSymptoms.length
                  ? suggestedSpeciality.matchedSymptoms
                  : selectedSymptoms
                ).map((symptom: Symptom) => (
                  <span
                    key={symptom.name}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {symptom.name}
                  </span>
                ))}
              </div>
            </div>
            <div className={cn("rounded-xl border p-4", urgencyStyle.panel)}>
              <p
                className={cn(
                  "text-xs uppercase tracking-wide",
                  urgencyStyle.label,
                )}
              >
                Triage
              </p>
              <p className="mt-1 text-lg font-semibold capitalize">
                {getTriageUrgencyLabel(urgency)}
              </p>
              <p className="mt-1 text-sm opacity-90">
                {urgency === "emergency"
                  ? "Neem onmiddellijk contact op met de spoedhulp."
                  : urgency === "urgent"
                    ? "Plan zo snel mogelijk een consult."
                    : "Een gewone afspraak is meestal voldoende."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AssessmentStep;
