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
      completionTitle="Intake captured"
      completionDescription="The wizard is finished and the intake details are ready for the next stage."
      finishLabel="Submit intake"
      onComplete={() => setSubmitted(true)}
    >
      <Wizard.Step
        title="Patient gegevens"
        description="Start with the basics so the care team knows who they are helping."
        validate={validatePatientDetails}
      >
        <PatientDetailsStep values={values} setValues={setValues} />
      </Wizard.Step>

      <Wizard.Step
        title="Symptoms"
        description="Capture the main concern and how urgent it feels right now."
        validate={validateSymptoms}
      >
        <SymptomsStep values={values} setValues={setValues} />
      </Wizard.Step>

      <Wizard.Step
        title="Review"
        description="Double-check the summary and confirm follow-up consent."
        validate={validateReview}
      >
        <ReviewStep values={values} setValues={setValues} />
      </Wizard.Step>
    </Wizard>
  );
}

export { TriageWizard };
