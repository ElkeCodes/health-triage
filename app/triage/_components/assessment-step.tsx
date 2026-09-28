"use client";

import * as React from "react";
import { Stethoscope } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { suggestSpeciality } from "../_lib/suggest-speciality";
import type { TriageFormValues } from "../_models/triage-form-values.type";
import {
  getNextStep,
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
  const {
    control,
    formState: { isSubmitSuccessful },
  } = useFormContext<TriageFormValues>();
  const values = useWatch({ control }) as TriageFormValues;
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
          <div className="grid gap-4 rounded-xl bg-background/80 p-4 ring-1 ring-border/60 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Aanbevolen
              </p>
              <p className="mt-1 text-lg font-semibold">
                {suggestedSpeciality.speciality.naam}
              </p>
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
              <p className="mt-1 text-sm opacity-90">{getNextStep(urgency)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {isSubmitSuccessful ? (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
          <AlertTitle>Triage verstuurd</AlertTitle>
          <AlertDescription>
            De intake is succesvol opgeslagen en doorgestuurd naar het team.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}

export default AssessmentStep;
