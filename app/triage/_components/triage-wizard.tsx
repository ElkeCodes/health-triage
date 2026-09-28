"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PatientDetailsStep from "./patient-details-step";
import ReviewStep from "./review-step";
import SymptomsStep from "./symptoms-step";
import AssessmentStep from "./assessment-step";
import { createTriage } from "../_lib/actions";
import { triageFormSchema } from "../_lib/triage-schema";
import type { Symptom } from "../_models/symptom.type";
import type { TriageFormValues } from "../_models/triage-form-values.type";
import { Wizard } from "@/components/wizard";

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
    z.input<typeof triageFormSchema>,
    undefined,
    z.output<typeof triageFormSchema>
  >({
    defaultValues: initialValues,
    shouldUnregister: false,
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(triageFormSchema),
  });
  const router = useRouter();
  const handleFinalSubmit = form.handleSubmit(async (values) => {
    await createTriage(values);
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleFinalSubmit}>
        <Wizard onCancel={() => router.push("/")} finishLabel="Versturen">
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
      </form>
    </FormProvider>
  );
}

export { TriageWizard };
