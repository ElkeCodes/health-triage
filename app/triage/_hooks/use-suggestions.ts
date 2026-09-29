import { useEffect, useMemo, useRef, useState } from "react";
import type { Symptom } from "../_models/symptom.type";
import { getSymptomSuggestions } from "../_lib/actions";

type UseSuggestionsInput = {
  selectedSymptoms: Symptom[];
  searchValue: string;
  initialSuggestions: Symptom[];
};

type UseSuggestionsResult = {
  suggestions: Symptom[];
  loading: boolean;
};

export function useSuggestions({
  selectedSymptoms,
  searchValue,
  initialSuggestions,
}: UseSuggestionsInput) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);
  const selectedSymptomNames = useMemo(
    () => selectedSymptoms.map((symptom) => symptom.name),
    [selectedSymptoms],
  );

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    const loadSuggestions = async () => {
      try {
        setLoading(true);

        const nextSuggestions = await getSymptomSuggestions({
          selectedSymptoms: selectedSymptomNames,
          searchValue,
        });

        if (
          requestId === requestIdRef.current &&
          Array.isArray(nextSuggestions) &&
          nextSuggestions.length
        ) {
          setSuggestions(nextSuggestions);
        }
      } catch {
        // we keep the current suggestions when AI is unavailable.
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    if (
      JSON.stringify(initialSuggestions) !== JSON.stringify(selectedSymptoms)
    ) {
      void loadSuggestions();
    }

    return () => {
      requestIdRef.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, selectedSymptomNames]);

  return { suggestions, loading } satisfies UseSuggestionsResult;
}
