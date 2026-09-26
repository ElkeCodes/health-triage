"use client";

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
import { suggestSpeciality } from "../_lib/suggest-speciality";
import { TriageFormValues } from "../_lib/triage-form-values";
import {
  getTriageUrgency,
  getTriageUrgencyLabel,
} from "../_lib/triage-urgency";
import { cn } from "@/lib/utils";
import { createTriage } from "../_lib/actions";

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
  const values = useWatch({ control }) as TriageFormValues;

  const triageSaved = React.useRef(false);
  React.useEffect(() => {
    const formData = new FormData();

    formData.set("age", values.age);
    formData.set("gender", values.gender ?? "");
    formData.set(
      "symptoms",
      values.symptoms.map((symptom) => symptom.name).join(","),
    );
    formData.set("urgency", getTriageUrgency(values.symptoms));
    formData.set("pathway", suggestSpeciality(values.symptoms).speciality.naam);
    formData.set("next", getTriageUrgency(values.symptoms) ?? ""); // temp solution
    formData.set("consultationType", getTriageUrgency(values.symptoms) ?? ""); // temp solution

    if (!triageSaved.current) {
      void createTriage(formData);
      triageSaved.current = true;
    }
  }, [values]);

  const urgency = React.useMemo(
    () => getTriageUrgency(values.symptoms),
    [values.symptoms],
  );
  const urgencyStyle = urgencyStyles[urgency];
  const suggestedSpeciality = React.useMemo(() => {
    return suggestSpeciality(values.symptoms);
  }, [values.symptoms]);

  return (
    <div className="grid gap-4">
      <Card className="border-primary/20 bg-primary/5">
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
                  ? `${suggestedSpeciality.score}/${values.symptoms.length || 0} symptomen`
                  : "0 symptomen"}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {(suggestedSpeciality.matchedSymptoms.length
                  ? suggestedSpeciality.matchedSymptoms
                  : values.symptoms
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
