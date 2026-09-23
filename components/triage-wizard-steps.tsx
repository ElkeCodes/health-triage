"use client";

import type * as React from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

type TriageFormValues = {
  age: string;
  gender: "male" | "female" | undefined;
  symptoms: string[];
  urgency: "mild" | "moderate" | "severe";
};

type TriageStepProps = {
  values: TriageFormValues;
  setValues: React.Dispatch<React.SetStateAction<TriageFormValues>>;
};

function PatientDetailsStep({ values, setValues }: TriageStepProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-2">
        <span className="text-sm font-medium">Leeftijd</span>
        <Input
          type="number"
          min="0"
          value={values.age}
          onChange={(event) =>
            setValues((current) => ({ ...current, age: event.target.value }))
          }
          placeholder="34"
          required
        />
      </label>

      <fieldset className="grid gap-2 md:col-span-2">
        <legend className="text-sm font-medium">Geboortegeslacht</legend>
        <RadioGroup
          value={values.gender}
          onValueChange={(value) =>
            setValues((current) => ({
              ...current,
              gender: value as TriageFormValues["gender"],
            }))
          }
          className="grid gap-3 sm:grid-cols-2"
        >
          <label className="flex items-center gap-3 rounded-lg border border-input px-3 py-2">
            <RadioGroupItem value="male" />
            <span>Man</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-input px-3 py-2">
            <RadioGroupItem value="female" />
            <span>Vrouw</span>
          </label>
        </RadioGroup>
      </fieldset>
    </div>
  );
}

function SymptomsStep({ values, setValues }: TriageStepProps) {
  return (
    <div className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-medium">
          Welke symptomen ervaart u?
        </span>
        <Textarea
          value={values.symptoms}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              symptoms: event.target.value.split("\n"),
            }))
          }
          placeholder="Describe the main symptoms, when they started, and anything that makes them better or worse."
          rows={5}
          required
        />
      </label>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium">Urgentie</legend>
        <RadioGroup
          value={values.urgency}
          onValueChange={(value) =>
            setValues((current) => ({
              ...current,
              urgency: value as TriageFormValues["urgency"],
            }))
          }
          className="grid gap-3"
        >
          <label className="flex items-center gap-3 rounded-lg border border-input px-3 py-2">
            <RadioGroupItem value="mild" />
            <span>Licht en stabiel</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-input px-3 py-2">
            <RadioGroupItem value="moderate" />
            <span>Matig en hinderlijk</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-input px-3 py-2">
            <RadioGroupItem value="severe" />
            <span>Ernstig of snel verslechterend</span>
          </label>
        </RadioGroup>
      </fieldset>
    </div>
  );
}

function ReviewStep({ values, setValues }: TriageStepProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 rounded-xl border border-input bg-muted/40 p-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Leeftijd</span>
          <span className="font-medium">{values.age || "—"}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Geboortegeslacht</span>
          <span className="font-medium">
            {values.gender?.toString().toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Urgentie</span>
          <span className="font-medium capitalize">{values.urgency}</span>
        </div>
      </div>
    </div>
  );
}

export type { TriageFormValues, TriageStepProps };
export { PatientDetailsStep, SymptomsStep, ReviewStep };
