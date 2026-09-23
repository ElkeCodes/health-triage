"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartTriageWizard() {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);
  return (
    <>
      <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox"
          name="terms-checkbox"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked)}
        />
        <Label htmlFor="terms-checkbox">
          Ik heb de gebruikersvoorwaarden gelezen en begrepen
        </Label>
      </Field>
      <Button onClick={() => router.push("/triage")} disabled={!termsAccepted}>
        Start de triage
      </Button>
    </>
  );
}
