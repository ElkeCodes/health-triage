import { useFormContext, Controller, useWatch } from "react-hook-form";
import { useState } from "react";
import type { Symptom } from "../_models/symptom.type";
import type { TriageFormValues } from "../_models/triage-form-values.type";
import { useSuggestions } from "../_hooks/use-suggestions";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

type SymptomsStepProps = {
  symptomOptions: Symptom[];
  suggestedSymptoms: Symptom[];
};

function SymptomsStep({
  symptomOptions,
  suggestedSymptoms,
}: SymptomsStepProps) {
  const { control, trigger } = useFormContext<TriageFormValues>();
  const watchedSymptoms = useWatch({
    control,
    name: "symptoms",
    defaultValue: [],
  });
  const [searchValue, setSearchValue] = useState("");
  const [recentSymptom, setRecentSymptom] = useState<string | null>(null);
  const { suggestions, loading } = useSuggestions({
    selectedSymptoms: watchedSymptoms,
    searchValue,
    initialSuggestions: suggestedSymptoms,
  });

  const filteredOptions = (options: Symptom[], selected: Symptom[]) => {
    const query = searchValue.trim().toLowerCase();

    return options.filter((option) => {
      const matchesQuery = !query || option.name.toLowerCase().includes(query);
      const isSelected = selected.some(
        (selectedSymptom) => selectedSymptom.name === option.name,
      );

      return matchesQuery && !isSelected;
    });
  };

  return (
    <div className="grid gap-4">
      <Controller
        control={control}
        name="symptoms"
        render={({ field, fieldState }) => {
          const syncSymptoms = (nextSymptoms: Symptom[]) => {
            field.onChange(nextSymptoms);
            void trigger("symptoms");
          };

          return (
            <FieldSet className="grid gap-3" aria-busy={loading}>
              <FieldLegend variant="label">
                Welke symptomen ervaart u?
              </FieldLegend>
              <Combobox
                inputValue={searchValue}
                onInputValueChange={(value, eventDetails) => {
                  if (eventDetails.reason == "input-change") {
                    setSearchValue(value);
                  }
                }}
                onValueChange={(value: string | null) => {
                  if (
                    !value ||
                    field.value.some((symptom) => symptom.name === value)
                  ) {
                    return;
                  }

                  const selectedSymptom = symptomOptions.find(
                    (symptom) => symptom.name === value,
                  );

                  if (!selectedSymptom) {
                    return;
                  }

                  setRecentSymptom(value);
                  syncSymptoms([...field.value, selectedSymptom]);
                  setSearchValue("");
                }}
              >
                <ComboboxInput
                  showTrigger={false}
                  id="symptom-search"
                  placeholder="Zoek een symptoom"
                />
                <ComboboxContent>
                  <ComboboxList>
                    {filteredOptions(symptomOptions, field.value).map(
                      (item) => (
                        <ComboboxItem key={item.name} value={item.name}>
                          {item.name}
                        </ComboboxItem>
                      ),
                    )}
                    {!filteredOptions(symptomOptions, field.value).length ? (
                      <ComboboxEmpty>Geen symptomen gevonden</ComboboxEmpty>
                    ) : null}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <div className="grid gap-2">
                {[
                  ...field.value,
                  ...suggestions.filter(
                    (symptom) =>
                      !field.value.some(
                        (selectedSymptom) =>
                          selectedSymptom.name === symptom.name,
                      ),
                  ),
                ].map((symptom) => {
                  const id = `symptom-${symptom.name.toLowerCase().replaceAll(" ", "-")}`;
                  const checked = field.value.some(
                    (selectedSymptom) => selectedSymptom.name === symptom.name,
                  );
                  const isRecent = recentSymptom === symptom.name;

                  return (
                    <Field
                      key={symptom.name}
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
                            syncSymptoms([...field.value, symptom]);
                          } else {
                            syncSymptoms(
                              field.value.filter(
                                (current) => current.name !== symptom.name,
                              ),
                            );
                          }
                        }}
                      />
                      <FieldLabel htmlFor={id} className="font-normal">
                        {symptom.name}
                      </FieldLabel>
                    </Field>
                  );
                })}
                {loading && (
                  <p className="text-sm text-muted-foreground">
                    Suggesties worden geladen...
                  </p>
                )}
              </div>
              <FieldError errors={[fieldState.error]} />
            </FieldSet>
          );
        }}
      />
    </div>
  );
}

export default SymptomsStep;
