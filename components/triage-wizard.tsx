"use client";

import * as React from "react";
import { Wizard } from "@/components/wizard";
import {
  PatientDetailsStep,
  ReviewStep,
  SymptomsStep,
  type TriageFormValues,
} from "@/components/triage-wizard-steps";

const initialValues: TriageFormValues = {
  age: "",
  gender: undefined,
  symptoms: [],
  urgency: "moderate",
};

function TriageWizard() {
  const [values, setValues] = React.useState(initialValues);
  const [submitted, setSubmitted] = React.useState(false);

  function validatePatientDetails() {
    const age = Number(values.age);
    if (!values.age.trim() || Number.isNaN(age) || age < 0) {
      return "Gelieve een geldige leeftijd in te vullen.";
    }

    return true;
  }

  function validateSymptoms() {
    if (!values.symptoms.length) {
      return "Een korte beschrijving van de symptomen helpt ons om het geval te beoordelen.";
    }

    return true;
  }

  function validateReview() {
    return true;
  }

  if (submitted) {
    return <p>Einde</p>;
  }

  return (
    <Wizard
      completionTitle="Intake vastgelegd"
      completionDescription="De wizard is voltooid en de intakegegevens zijn klaar voor de volgende fase."
      finishLabel="Verstuur intake"
      onComplete={() => setSubmitted(true)}
    >
      <Wizard.Step
        title="Patiëntgegevens"
        description="Begin met de basisinformatie zodat het zorgteam weet wie ze helpen."
        validate={validatePatientDetails}
      >
        <PatientDetailsStep values={values} setValues={setValues} />
      </Wizard.Step>

      <Wizard.Step
        title="Welke symptomen heeft u?"
        description="Geef aan welke symptomen u heeft en hoe urgent deze op dit moment aanvoelen."
        validate={validateSymptoms}
      >
        <SymptomsStep values={values} setValues={setValues} />
      </Wizard.Step>

      <Wizard.Step
        title="Review"
        description="Controleer de samenvatting en bevestig toestemming voor vervolg."
        validate={validateReview}
      >
        <ReviewStep values={values} setValues={setValues} />
      </Wizard.Step>
    </Wizard>
  );
}

export { TriageWizard };
