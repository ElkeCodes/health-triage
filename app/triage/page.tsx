import { TriageWizard } from "@/components/triage-wizard";

export default function TriagePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Health triage
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Wat zijn uw symptomen?
          </h1>
        </div>
        <TriageWizard />
      </main>
    </div>
  );
}
