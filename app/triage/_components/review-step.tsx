import { useFormContext, useWatch } from "react-hook-form";
import type { TriageFormValues } from "../_models/triage-form-values.type";

function ReviewStep() {
  const { control } = useFormContext<TriageFormValues>();
  const values = useWatch<TriageFormValues>({ control });

  const genderLabel =
    values.gender === "male"
      ? "Man"
      : values.gender === "female"
        ? "Vrouw"
        : "—";

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 rounded-xl border border-input bg-muted/40 p-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Leeftijd</span>
          <span className="font-medium">{values.age || "—"}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Geboortegeslacht</span>
          <span className="font-medium">{genderLabel}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Symptomen</span>
          <span className="font-medium text-right">
            {values.symptoms?.length
              ? values.symptoms.map((symptom) => symptom.name).join(", ")
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ReviewStep;
