import StartTriageWizard from "@/app/_components/start-triage-wizard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircleIcon } from "lucide-react";

export default function Home() {
  return (
    <>
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Health triage
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Wij helpen u om de juiste zorg te krijgen.
        </h1>
      </div>
      <Alert variant="destructive" className="bg-red-100">
        <AlertCircleIcon />
        <AlertTitle>Belangrijk</AlertTitle>
        <AlertDescription>
          Indien u kortademig bent, pijn op de borst hebt of zich suf voelt,
          neem onmiddellijk contact op met de hulpdiensten door{" "}
          <a href="tel:X">112 te bellen</a>.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Hoe werkt deze tool?</CardTitle>
        </CardHeader>
        <CardContent>
          Deze tool helpt u om uw symptomen te beoordelen en te bepalen welke
          zorg het meest geschikt is. Volg de stappen in de volgende schermen en
          vul de gevraagde informatie in om zo accuraat mogelijk geholpen te
          worden.
        </CardContent>
      </Card>
      <StartTriageWizard />
    </>
  );
}
