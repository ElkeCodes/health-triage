import { useFormContext, Controller } from "react-hook-form";
import { TriageFormValues } from "../_lib/triage-form-values";
import triageValidation from "../_lib/validation";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib/utils";
import { useState } from "react";

type SymptomsStepProps = {
  symptomOptions: string[];
  mostPopularSymptoms: string[];
};

function SymptomsStep({
  symptomOptions,
  mostPopularSymptoms,
}: SymptomsStepProps) {
  const { control, trigger } = useFormContext<TriageFormValues>();
  const [searchValue, setSearchValue] = useState("");
  const [recentSymptom, setRecentSymptom] = useState<string | null>(null);
  const filteredOptions = (options: string[], selected: string[]) =>
    options.filter((option) => !selected.includes(option));

  return (
    <div className="grid gap-4">
      <Controller
        control={control}
        name="symptoms"
        rules={triageValidation.symptoms}
        render={({ field, fieldState }) => (
          <FieldSet className="grid gap-3">
            <FieldLegend variant="label">
              Welke symptomen ervaart u?
            </FieldLegend>
            <Combobox
              inputValue={searchValue}
              onInputValueChange={(value) => {
                setSearchValue(value);
              }}
              onValueChange={(value: string | null) => {
                if (!value || field.value.includes(value)) {
                  return;
                }

                setSearchValue("");
                setRecentSymptom(value);
                field.onChange([...field.value, value]);
                void trigger("symptoms");
              }}
            >
              <ComboboxInput
                id="symptom-search"
                placeholder="Selecteer een symptoom"
              />
              <ComboboxContent>
                <ComboboxList>
                  {filteredOptions(symptomOptions, field.value).map((item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )) || <ComboboxEmpty>Geen symptomen gevonden</ComboboxEmpty>}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <div className="grid gap-2">
              {[
                ...field.value,
                ...mostPopularSymptoms.filter(
                  (symptom) => !field.value.includes(symptom),
                ),
              ].map((symptom) => {
                const id = `symptom-${symptom.toLowerCase()}`;
                const checked = field.value.includes(symptom);
                const isRecent = recentSymptom === symptom;

                return (
                  <Field
                    key={symptom}
                    orientation="horizontal"
                    className={cn(
                      "items-center gap-3 rounded-lg border border-input px-3 py-2",
                      {
                        "animate-highlight": isRecent,
                      },
                    )}
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
                            field.value.filter(
                              (current: string) => current !== symptom,
                            ),
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
                <FieldLabel htmlFor="urgency-mild" className="font-normal">
                  Licht en stabiel
                </FieldLabel>
              </RadioGroupItemContainer>
              <RadioGroupItemContainer>
                <RadioGroupItem value="moderate" id="urgency-moderate" />
                <FieldLabel htmlFor="urgency-moderate" className="font-normal">
                  Matig en hinderlijk
                </FieldLabel>
              </RadioGroupItemContainer>
              <RadioGroupItemContainer>
                <RadioGroupItem value="severe" id="urgency-severe" />
                <FieldLabel htmlFor="urgency-severe" className="font-normal">
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

export default SymptomsStep;
