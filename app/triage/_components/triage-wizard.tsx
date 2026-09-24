"use client";

import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Wizard } from "@/components/wizard";
import {
  PatientDetailsStep,
  ReviewStep,
  SymptomsStep,
  type TriageFormValues,
} from "./triage-wizard-steps";

const initialValues: TriageFormValues = {
  age: "",
  gender: null,
  symptoms: [],
  urgency: "moderate",
};

function TriageWizard() {
  const [submitted, setSubmitted] = React.useState(false);
  const form = useForm<TriageFormValues>({
    defaultValues: initialValues,
    shouldUnregister: false,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  if (submitted) {
    return <p>Einde</p>;
  }

  return (
    <FormProvider {...form}>
      <Wizard
        completionTitle="Intake vastgelegd"
        completionDescription="De wizard is voltooid en de intakegegevens zijn klaar voor de volgende fase."
        finishLabel="Verstuur intake"
        onComplete={() => setSubmitted(true)}
      >
        <Wizard.Step
          title="Patiëntgegevens"
          description="Begin met de basisinformatie zodat het zorgteam weet wie ze helpen."
          fields={["age", "gender"]}
        >
          <PatientDetailsStep />
        </Wizard.Step>

        <Wizard.Step
          title="Welke symptomen heeft u?"
          description="Geef aan welke symptomen u heeft en hoe urgent deze op dit moment aanvoelen."
          fields={["symptoms", "urgency"]}
        >
          <SymptomsStep />
        </Wizard.Step>

        <Wizard.Step
          title="Review"
          description="Controleer de samenvatting en bevestig toestemming voor vervolg."
        >
          <ReviewStep />
        </Wizard.Step>
      </Wizard>
    </FormProvider>
  );
}

export { TriageWizard };
