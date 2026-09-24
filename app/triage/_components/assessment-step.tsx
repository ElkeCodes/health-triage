"use client";

import * as React from "react";
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

function AssessmentStep() {
  const { control } = useFormContext<TriageFormValues>();
  const selectedSymptoms = useWatch({
    control,
    name: "symptoms",
    defaultValue: [],
  });
  const suggestedSpeciality = React.useMemo(() => {
    const scoredSpecialities = SPECIALITIES.map((speciality, index) => {
      const matchedSymptoms = speciality.symptomen.filter((symptom) =>
        selectedSymptoms.includes(symptom),
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
                  ? `${suggestedSpeciality.score}/${selectedSymptoms.length || 0} symptomen`
                  : "0 symptomen"}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {(suggestedSpeciality.matchedSymptoms.length
                  ? suggestedSpeciality.matchedSymptoms
                  : selectedSymptoms
                ).map((symptom) => (
                  <span
                    key={symptom}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Volgende stap
              </p>
              <p className="mt-1 text-lg font-semibold">Plan een consult</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AssessmentStep;
