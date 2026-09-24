"use client";

import type * as React from "react";
import { Input } from "@/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemContainer,
} from "@/components/ui/radio-group";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel, FieldLegend, FieldSet } from "./ui/field";

type TriageFormValues = {
  age: string;
  gender: "male" | "female" | null;
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
      <Field className="grid gap-2">
        <FieldLabel htmlFor="age">Leeftijd</FieldLabel>
        <Input
          id="age"
          type="number"
          min="0"
          value={values.age}
          onChange={(event) =>
            setValues((current) => ({ ...current, age: event.target.value }))
          }
          placeholder="34"
          required
        />
      </Field>

      <FieldSet className="grid gap-2 md:col-span-2">
        <FieldLegend variant="label">Geboortegeslacht</FieldLegend>
        <RadioGroup
          value={values.gender}
          onValueChange={(value) =>
            setValues((current) => ({
              ...current,
              gender: value as TriageFormValues["gender"],
            }))
          }
        >
          <RadioGroupItemContainer>
            <RadioGroupItem value="male" id="gender-male" />
            <FieldLabel htmlFor="gender-male" className="font-normal">
              Man
            </FieldLabel>
          </RadioGroupItemContainer>
          <RadioGroupItemContainer>
            <RadioGroupItem value="female" id="gender-female" />
            <FieldLabel htmlFor="gender-female" className="font-normal">
              Vrouw
            </FieldLabel>
          </RadioGroupItemContainer>
        </RadioGroup>
      </FieldSet>
    </div>
  );
}

function SymptomsStep({ values, setValues }: TriageStepProps) {
  const symptoms = [
    "Hoofdpijn",
    "Koorts",
    "Verkouden",
    "Misselijkheid",
    "Buikpijn",
  ];
  return (
    <div className="grid gap-4">
      <Field className="grid gap-2">
        <FieldLabel htmlFor="symptoms-combobox">
          Welke symptomen ervaart u?
        </FieldLabel>
        <Combobox items={symptoms}>
          <ComboboxInput
            id="symptoms-combobox"
            placeholder="Selecteer een symptoom"
          />
          <ComboboxContent>
            <ComboboxEmpty>Geen symptomen gevonden.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>

      <FieldSet className="grid gap-2">
        <FieldLegend variant="label">Urgentie</FieldLegend>
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
          <RadioGroupItemContainer>
            <RadioGroupItem value="mild" id="urgency-mild" />
            <FieldLabel htmlFor="urgency-mild">Licht en stabiel</FieldLabel>
          </RadioGroupItemContainer>
          <RadioGroupItemContainer>
            <RadioGroupItem value="moderate" id="urgency-moderate" />
            <FieldLabel htmlFor="urgency-moderate">
              Matig en hinderlijk
            </FieldLabel>
          </RadioGroupItemContainer>
          <RadioGroupItemContainer>
            <RadioGroupItem value="severe" id="urgency-severe" />
            <FieldLabel htmlFor="urgency-severe">
              Ernstig of snel verslechterend
            </FieldLabel>
          </RadioGroupItemContainer>
        </RadioGroup>
      </FieldSet>
    </div>
  );
}

function ReviewStep({ values }: TriageStepProps) {
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
