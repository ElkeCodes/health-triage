"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wizard } from "@/components/wizard";
import PatientDetailsStep from "./patient-details-step";
import ReviewStep from "./review-step";
import SymptomsStep from "./symptoms-step";
import AssessmentStep from "./assessment-step";
import { createTriageInputSchema } from "../_lib/triage-schema";
import type {
  Symptom,
  TriageFormValues,
} from "@/app/triage/_lib/triage-form-values";

type TriageWizardProps = {
  symptomOptions: Symptom[];
  mostPopularSymptoms: Symptom[];
};

const initialValues: TriageFormValues = {
  age: "",
  gender: null,
  symptoms: [],
};

function TriageWizard({
  symptomOptions,
  mostPopularSymptoms,
}: TriageWizardProps) {
  const form = useForm<
    z.input<typeof createTriageInputSchema>,
    undefined,
    z.output<typeof createTriageInputSchema>
  >({
    defaultValues: initialValues,
    shouldUnregister: false,
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(createTriageInputSchema),
  });
  const router = useRouter();

  return (
    <FormProvider {...form}>
      <Wizard
        onCancel={() => router.push("/")}
        onClose={() => router.push("/")}
      >
        <Wizard.Step
          title="Patiëntgegevens"
          description="Begin met de basisinformatie zodat het zorgteam weet wie ze helpen."
          fields={["age", "gender"]}
        >
          <PatientDetailsStep />
        </Wizard.Step>

        <Wizard.Step
          title="Welke symptomen ervaart u?"
          description="Geef aan welke symptomen u ervaart en hoe urgent deze op dit moment aanvoelen."
          fields={["symptoms", "urgency"]}
        >
          <SymptomsStep
            symptomOptions={symptomOptions}
            mostPopularSymptoms={mostPopularSymptoms}
          />
        </Wizard.Step>

        <Wizard.Step
          title="Overzicht"
          description="Controleer de ingevulde data en verstuur deze naar het zorgteam"
        >
          <ReviewStep />
        </Wizard.Step>

        <Wizard.Step
          title="Hoe gaat het verder?"
          description="U heeft alle stappen van de intake doorlopen."
        >
          <AssessmentStep />
        </Wizard.Step>
      </Wizard>
    </FormProvider>
  );
}

export { TriageWizard };
