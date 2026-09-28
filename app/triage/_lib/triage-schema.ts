import z from "zod";

const symptomSchema = z.object({
  name: z.string().min(1, "Elke symptoomnaam moet een waarde hebben."),
  urgency: z.number().int().min(1).max(3),
});

export const triageFormSchema = z.object({
  age: z
    .string()
    .trim()
    .min(1, "Gelieve een geldige leeftijd in te vullen.")
    .refine((value) => {
      const age = Number(value);
      return Number.isInteger(age) && age >= 0;
    }, "Gelieve een geldige leeftijd in te vullen.")
    .transform((value) => Number(value)),
  gender: z
    .enum(["male", "female"])
    .nullable()
    .transform((value, context) => {
      if (value === null) {
        context.addIssue({
          code: "custom",
          message: "Selecteer het geboortegeslacht.",
        });

        return z.NEVER;
      }

      return value;
    }),
  symptoms: z
    .array(symptomSchema)
    .min(1, "Gelieve minstens één symptoom te selecteren."),
});

export const triagePayloadSchema = triageFormSchema.extend({
  age: z.number().int().min(0),
});

export type TriagePayload = z.infer<typeof triagePayloadSchema>;
