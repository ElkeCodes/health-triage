import { useFormContext, Controller, useWatch } from "react-hook-form";
import { useMemo, useState } from "react";
import type { Symptom } from "../_models/symptom.type";
import type { TriageFormValues } from "../_models/triage-form-values.type";
import { useSuggestions } from "../_hooks/use-suggestions";
import { getSymptomFollowUp } from "../_lib/symptom-follow-up";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const { setValue } = useFormContext<TriageFormValues>();
  const watchedSymptoms = useWatch({
    control,
    name: "symptoms",
    defaultValue: [],
  });
  const [searchValue, setSearchValue] = useState("");
  const [recentSymptom, setRecentSymptom] = useState<string | null>(null);
  const [activeFollowUpSymptoms, setActiveFollowUpSymptoms] = useState<string[]>(
    [],
  );
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string[]>>(
    {},
  );

  const followUpContext = useMemo(
    () =>
      watchedSymptoms.map((symptom) => {
        const answer = followUpAnswers[symptom.name];

        return answer?.length ? `${symptom.name}: ${answer.join(", ")}` : symptom.name;
      }),
    [followUpAnswers, watchedSymptoms],
  );

  const { suggestions, loading } = useSuggestions({
    selectedSymptoms: watchedSymptoms,
    searchValue,
    initialSuggestions: suggestedSymptoms,
    followUpContext,
  });

  const activeFollowUpQuestions = useMemo(
    () =>
      activeFollowUpSymptoms
        .map((symptomName) => getSymptomFollowUp(symptomName))
        .filter((question) =>
          watchedSymptoms.some(
            (symptom) => symptom.name === question.symptomName,
          ),
        ),
    [activeFollowUpSymptoms, watchedSymptoms],
  );

  const syncQuestionValues = (
    nextActiveSymptoms: string[],
    nextAnswers: Record<string, string[]>,
  ) => {
    setValue(
      "questions",
      nextActiveSymptoms.map((symptomName) => {
        const question = getSymptomFollowUp(symptomName);

        return {
          symptomName: question.symptomName,
          questionKey: question.questionKey,
          questionText: question.question,
          answerValues: nextAnswers[symptomName] ?? [],
          options: question.options,
        };
      }),
      { shouldDirty: true, shouldValidate: true },
    );
  };

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

          const markSymptomSelected = (symptomName: string) => {
            setRecentSymptom(symptomName);
            setActiveFollowUpSymptoms((current) =>
              current.includes(symptomName) ? current : [...current, symptomName],
            );
          };

          const selectSymptom = (symptomName: string) => {
            const selectedSymptom = symptomOptions.find(
              (symptom) => symptom.name === symptomName,
            );

            if (!selectedSymptom) {
              return;
            }

            if (field.value.some((symptom) => symptom.name === symptomName)) {
              markSymptomSelected(symptomName);
              return;
            }

            const nextActiveSymptoms = activeFollowUpSymptoms.includes(symptomName)
              ? activeFollowUpSymptoms
              : [...activeFollowUpSymptoms, symptomName];

            markSymptomSelected(symptomName);
            syncSymptoms([...field.value, selectedSymptom]);
            syncQuestionValues(nextActiveSymptoms, followUpAnswers);
            setSearchValue("");
          };

          const deselectSymptom = (symptomName: string) => {
            const nextSymptoms = field.value.filter(
              (current) => current.name !== symptomName,
            );
            const nextActiveSymptoms = activeFollowUpSymptoms.filter(
              (name) => name !== symptomName,
            );
            const nextAnswers = { ...followUpAnswers };

            delete nextAnswers[symptomName];

            syncSymptoms(nextSymptoms);
            setFollowUpAnswers(nextAnswers);
            setActiveFollowUpSymptoms(nextActiveSymptoms);
            syncQuestionValues(nextActiveSymptoms, nextAnswers);
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
                  if (!value) {
                    return;
                  }

                  selectSymptom(value);
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
              {field.value.length ? (
                <div className="grid gap-2">
                  {activeFollowUpQuestions.length ? (
                    <div className="grid gap-3">
                      {activeFollowUpQuestions.map((question) => (
                        <Card
                          key={question.symptomName}
                          size="sm"
                          className="border-primary/20 bg-primary/5"
                        >
                          <CardHeader>
                            <CardTitle className="text-sm">
                              Vervolgvraag voor {question.symptomName}
                            </CardTitle>
                            <CardDescription>
                              {question.question}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="grid gap-3 pt-0">
                            <FieldDescription>{question.helperText}</FieldDescription>
                            <div className="grid gap-2">
                              {question.options.map((option) => {
                                const id = `follow-up-${question.symptomName.toLowerCase().replaceAll(" ", "-")}-${option.toLowerCase().replaceAll(" ", "-")}`;
                                const selectedOptions =
                                  followUpAnswers[question.symptomName] ?? [];
                                const checked = selectedOptions.includes(option);

                                return (
                                  <Field
                                    key={option}
                                    orientation="horizontal"
                                    className="items-center gap-3 rounded-lg border border-input px-3 py-2"
                                  >
                                    <Checkbox
                                      id={id}
                                      checked={checked}
                                      onCheckedChange={(nextChecked) => {
                                        const isChecked = Boolean(nextChecked);

                                        setFollowUpAnswers((current) => {
                                          const currentOptions = current[
                                            question.symptomName
                                          ]
                                            ? [...current[question.symptomName]]
                                            : [];

                                          if (isChecked) {
                                            if (!currentOptions.includes(option)) {
                                              currentOptions.push(option);
                                            }
                                          } else {
                                            const optionIndex = currentOptions.indexOf(option);

                                            if (optionIndex >= 0) {
                                              currentOptions.splice(optionIndex, 1);
                                            }
                                          }

                                          const nextAnswers = {
                                            ...current,
                                            [question.symptomName]: currentOptions,
                                          };

                                          syncQuestionValues(
                                            activeFollowUpSymptoms,
                                            nextAnswers,
                                          );

                                          return nextAnswers;
                                        });
                                      }}
                                    />
                                    <FieldLabel htmlFor={id} className="font-normal">
                                      {option}
                                    </FieldLabel>
                                  </Field>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
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
                            selectSymptom(symptom.name);
                          } else {
                            deselectSymptom(symptom.name);
                          }
                        }}
                      />
                      <FieldLabel htmlFor={id} className="font-normal">
                        <span className="flex flex-col gap-1">
                          <span>{symptom.name}</span>
                          {followUpAnswers[symptom.name]?.length ? (
                            <span className="text-xs text-muted-foreground">
                              {followUpAnswers[symptom.name].join(", ")}
                            </span>
                          ) : null}
                        </span>
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
