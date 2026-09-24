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
import { Input } from "@/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemContainer,
} from "@/components/ui/radio-group";

export default function PatientDetailsStep() {
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
