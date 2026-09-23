import { TriageWizard } from "@/components/triage-wizard";

export default function TriagePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-12">
        <TriageWizard />
      </main>
    </div>
  );
}
