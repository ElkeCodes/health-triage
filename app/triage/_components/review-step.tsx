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

      <div className="grid gap-3 rounded-xl border border-input bg-background p-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Vervolgvraag-antwoorden</span>
          <span className="font-medium">{values.questions?.length ?? 0}</span>
        </div>
        <div className="grid gap-3">
          {values.questions?.length ? (
            values.questions.map((question) => (
              <div
                key={`${question.symptomName}-${question.questionKey}`}
                className="grid gap-1 rounded-lg border border-input p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid gap-0.5">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {question.symptomName}
                    </span>
                    <span className="font-medium">{question.questionText}</span>
                  </div>
                </div>
                <div className="text-muted-foreground">
                  {(question.answerValues ?? []).length
                    ? (question.answerValues ?? []).join(", ")
                    : "Nog geen antwoord"}
                </div>
              </div>
            ))
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewStep;
