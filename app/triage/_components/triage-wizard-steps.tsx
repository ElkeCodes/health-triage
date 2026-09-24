"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemContainer,
} from "@/components/ui/radio-group";

type TriageFormValues = {
  age: string;
  gender: "male" | "female" | null;
  symptoms: string[];
  urgency: "mild" | "moderate" | "severe";
};

const triageValidation = {
  age: {
    required: "Gelieve een geldige leeftijd in te vullen.",
    validate: (value: string) => {
      const age = Number(value);

      if (!value.trim() || Number.isNaN(age) || age < 0) {
        return "Gelieve een geldige leeftijd in te vullen.";
      }

      return true;
    },
  },
  gender: {
    required: "Selecteer het geboortegeslacht.",
  },
  symptoms: {
    validate: (value: string[]) =>
      value.length > 0 ||
      "Een korte beschrijving van de symptomen helpt ons om het geval te beoordelen.",
  },
  urgency: {
    required: "Selecteer de urgentie.",
  },
};

const symptomOptions = [
  "Hoofdpijn",
  "Koorts",
  "Verkouden",
  "Misselijkheid",
  "Buikpijn",
];

function PatientDetailsStep() {
  const {
    register,
    control,
    trigger,
    formState: { errors },
  } = useFormContext<TriageFormValues>();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field className="grid gap-2">
        <FieldLabel htmlFor="age">Leeftijd</FieldLabel>
        <Input
          id="age"
          type="number"
          min="0"
          placeholder="34"
          aria-invalid={errors.age ? "true" : "false"}
          {...register("age", {
            ...triageValidation.age,
            onChange: () => {
              void trigger("age");
            },
          })}
        />
        <FieldError errors={[errors.age]} />
      </Field>

      <Controller
        control={control}
        name="gender"
        rules={triageValidation.gender}
        render={({ field, fieldState }) => (
          <FieldSet className="grid gap-2 md:col-span-2">
            <FieldLegend variant="label">Geboortegeslacht</FieldLegend>
            <RadioGroup
              value={field.value ?? ""}
              onValueChange={(value) => {
                field.onChange(value || null);
                void trigger("gender");
              }}
              aria-invalid={fieldState.invalid ? "true" : "false"}
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
            <FieldError errors={[fieldState.error]} />
          </FieldSet>
        )}
      />
    </div>
  );
}

function SymptomsStep() {
  const { control, trigger } = useFormContext<TriageFormValues>();

  return (
    <div className="grid gap-4">
      <Controller
        control={control}
        name="symptoms"
        rules={triageValidation.symptoms}
        render={({ field, fieldState }) => (
          <FieldSet className="grid gap-3">
            <FieldLegend variant="label">Welke symptomen ervaart u?</FieldLegend>
            <div className="grid gap-2">
              {symptomOptions.map((symptom) => {
                const id = `symptom-${symptom.toLowerCase()}`;
                const checked = field.value.includes(symptom);

                return (
                  <Field
                    key={symptom}
                    orientation="horizontal"
                    className="items-center gap-3 rounded-lg border border-input px-3 py-2"
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(nextChecked) => {
                        const isChecked = Boolean(nextChecked);

                        if (isChecked) {
                          field.onChange([...field.value, symptom]);
                        } else {
                          field.onChange(
                            field.value.filter((current) => current !== symptom),
                          );
                        }
                        void trigger("symptoms");
                      }}
                    />
                    <FieldLabel htmlFor={id} className="font-normal">
                      {symptom}
                    </FieldLabel>
                  </Field>
                );
              })}
            </div>
            <FieldError errors={[fieldState.error]} />
          </FieldSet>
        )}
      />

      <Controller
        control={control}
        name="urgency"
        rules={triageValidation.urgency}
        render={({ field, fieldState }) => (
          <FieldSet className="grid gap-2">
            <FieldLegend variant="label">Urgentie</FieldLegend>
            <RadioGroup
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                void trigger("urgency");
              }}
              className="grid gap-3"
              aria-invalid={fieldState.invalid ? "true" : "false"}
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
            <FieldError errors={[fieldState.error]} />
          </FieldSet>
        )}
      />
    </div>
  );
}

function ReviewStep() {
  const { control } = useFormContext<TriageFormValues>();
  const values = useWatch({ control }) as TriageFormValues;

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
            {values.symptoms.length ? values.symptoms.join(", ") : "—"}
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

export type { TriageFormValues };
export { PatientDetailsStep, SymptomsStep, ReviewStep };