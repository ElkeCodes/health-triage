import { Agent } from "@mastra/core/agent";
import { z } from "zod";
import type { Symptom } from "../_models/symptom.type";
import {
  defaultSuggestedSymptoms,
  symptomOptions,
  symptomOptionsByName,
} from "./symptom-options";

const symptomSuggestionSchema = z.object({
  suggestions: z.array(z.string()).length(5),
});

const symptomSuggestionAgent = new Agent({
  id: "symptom-suggestion-agent",
  name: "Symptom Suggestion Agent",
  instructions: [
    "Je bent een triage-assistent voor symptoomsuggesties.",
    "Kies altijd precies 5 unieke symptomen uit de aangeleverde lijst.",
    "Stel geen diagnoses en geef geen medisch advies; alleen relevante vervolgsymptomen.",
    "Laat symptomen die al geselecteerd zijn weg.",
    "Gebruik de huidige zoekterm als extra hint om dichter bij het onderwerp te blijven.",
    "Geef de voorkeur aan symptomen die logisch aansluiten op de geselecteerde symptomen en de zoekterm.",
    "Antwoord uitsluitend met de namen van symptomen uit de lijst, zonder extra uitleg.",
  ],
  model: "google/gemini-3.5-flash",
});

type SuggestSymptomsInput = {
  selectedSymptoms: string[];
  searchValue: string;
};

function uniqueByName(symptoms: Symptom[]) {
  return Array.from(
    new Map(
      symptoms.map((symptom) => [symptom.name, symptom] as const),
    ).values(),
  );
}

function buildFallbackSymptoms(selectedSymptoms: string[]) {
  const selectedNames = new Set(selectedSymptoms);

  const fallbackCandidates = uniqueByName([
    ...defaultSuggestedSymptoms,
    ...symptomOptions,
  ]).filter((symptom) => !selectedNames.has(symptom.name));

  return fallbackCandidates.slice(0, 5);
}

function normalizeSuggestions(
  rawSuggestions: string[],
  selectedSymptoms: string[],
) {
  const selectedNames = new Set(selectedSymptoms);
  const normalized = rawSuggestions
    .map((name) => symptomOptionsByName.get(name))
    .filter((symptom): symptom is Symptom => Boolean(symptom))
    .filter((symptom) => !selectedNames.has(symptom.name));

  const merged = uniqueByName([
    ...normalized,
    ...buildFallbackSymptoms(selectedSymptoms),
  ]);

  return merged.slice(0, 5);
}

export async function suggestSymptoms({
  selectedSymptoms,
  searchValue,
}: SuggestSymptomsInput) {
  const selectedNames = selectedSymptoms.filter(Boolean);
  const search = searchValue.trim();

  try {
    const prompt = [
      `Beschikbare symptomen: ${symptomOptions.map((symptom) => symptom.name).join(", ")}`,
      selectedNames.length
        ? `Al geselecteerd: ${selectedNames.join(", ")}`
        : "Er zijn nog geen symptomen geselecteerd.",
      search
        ? `Huidige zoekterm: ${search}`
        : "De gebruiker typt nog geen extra zoekterm.",
      "Geef 5 nieuwe, relevante symptomen terug uit de beschikbare lijst.",
    ].join("\n");

    const response = await symptomSuggestionAgent.generate(prompt, {
      structuredOutput: {
        schema: symptomSuggestionSchema,
        jsonPromptInjection: "auto",
        errorStrategy: "fallback",
        fallbackValue: {
          suggestions: buildFallbackSymptoms(selectedNames).map(
            (symptom) => symptom.name,
          ),
        },
      },
      modelSettings: {
        temperature: 0.4,
        maxOutputTokens: 200,
      },
    });

    return normalizeSuggestions(
      response.object?.suggestions ?? [],
      selectedNames,
    );
  } catch (error: unknown) {
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? (error as { statusCode?: number }).statusCode
        : undefined;
    if (statusCode === 503) {
      console.error("Service unavailable (503). Returning fallback symptoms.");
    }
    return buildFallbackSymptoms(selectedNames);
  }
}
