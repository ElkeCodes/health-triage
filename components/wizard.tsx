"use client";

import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { cn } from "cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFormContext } from "react-hook-form";

type WizardStepProps = {
  title: string;
  description?: string;
  fields?: string[];
  children: React.ReactNode;
};

function WizardStep({ children }: WizardStepProps) {
  return <>{children}</>;
}

type WizardProps = {
  className?: string;
  children: React.ReactNode;
  completionTitle?: string;
  completionDescription?: string;
  previousLabel?: string;
  firstStepPreviousLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  onCancel?: () => void;
  initialStep?: number;
};

type WizardStepElement = React.ReactElement<WizardStepProps, typeof WizardStep>;

type WizardComponent = React.FC<WizardProps> & {
  Step: typeof WizardStep;
};

function WizardRoot({
  className,
  children,
  previousLabel = "Vorige",
  firstStepPreviousLabel = "Annuleren",
  nextLabel = "Volgende",
  initialStep = 0,
  onCancel,
}: WizardProps) {
  const steps = React.useMemo(() => {
    return React.Children.toArray(children).filter(
      (child): child is WizardStepElement =>
        React.isValidElement(child) && child.type === WizardStep,
    );
  }, [children]);

  const [currentStep, setCurrentStep] = React.useState(() => {
    if (!steps.length) return 0;
    return Math.min(Math.max(initialStep, 0), steps.length - 1);
  });
  const form = useFormContext();

  const activeStepIndex = steps.length
    ? Math.min(Math.max(currentStep, 0), steps.length - 1)
    : 0;
  const currentStepDefinition = steps[activeStepIndex];
  const progress = steps.length
    ? ((activeStepIndex + 1) / steps.length) * 100
    : 0;
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === steps.length - 1;

  async function handleNext() {
    if (!currentStepDefinition) return;

    const isStepValid = form
      ? await form.trigger(
          isLastStep ? undefined : currentStepDefinition.props.fields,
        )
      : true;

    if (!isStepValid) {
      return;
    }

    setCurrentStep((previousStep) =>
      Math.min(previousStep + 1, steps.length - 1),
    );
  }

  function handlePrevious() {
    if (isFirstStep) {
      onCancel?.();
      return;
    }
    setCurrentStep((previousStep) => Math.max(previousStep - 1, 0));
  }

  if (!steps.length) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTitle>No wizard steps found</AlertTitle>
        <AlertDescription>
          Add one or more <code>Wizard.Step</code> children before rendering the
          wizard.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Progress
        value={progress}
        aria-label={`Stap ${activeStepIndex + 1} van de ${steps.length}`}
      >
        <ProgressLabel>{`Stap ${activeStepIndex + 1} van de ${steps.length}`}</ProgressLabel>
      </Progress>
      <div className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {currentStepDefinition.props.title}
        </h1>
      </div>

      {currentStepDefinition.props.description ? (
        <p className="text-sm text-muted-foreground">
          {currentStepDefinition.props.description}
        </p>
      ) : null}

      <div className="space-y-6">
        {steps.map((step, index) => (
          <section
            key={step.props.title}
            hidden={index !== activeStepIndex}
            aria-hidden={index !== activeStepIndex}
            className={cn(index === activeStepIndex ? "block" : "hidden")}
          >
            {step.props.children}
          </section>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 fixed bottom-0 left-0 right-0 bg-background p-4 border border-muted">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
        >
          <ChevronLeft />
          {isFirstStep ? firstStepPreviousLabel : previousLabel}
        </Button>

        {!isLastStep ? (
          <Button type="button" onClick={handleNext}>
            {nextLabel}
            <ChevronRight />
          </Button>
        ) : null}
      </div>
    </>
  );
}

const Wizard = Object.assign(WizardRoot, {
  Step: WizardStep,
}) as WizardComponent;

export { Wizard, WizardStep };
export type { WizardProps, WizardStepProps };
