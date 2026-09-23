"use client";

import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { cn } from "cn";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

type WizardValidationResult =
  | boolean
  | string
  | void
  | Promise<boolean | string | void>;

type WizardValidationContext = {
  stepIndex: number;
  stepCount: number;
  isFirstStep: boolean;
  isLastStep: boolean;
};

type WizardStepProps = {
  title: string;
  description?: string;
  validate?: (context: WizardValidationContext) => WizardValidationResult;
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
  nextLabel?: string;
  finishLabel?: string;
  initialStep?: number;
  onComplete?: () => void | Promise<void>;
};

type WizardStepElement = React.ReactElement<WizardStepProps, typeof WizardStep>;

type WizardComponent = React.FC<WizardProps> & {
  Step: typeof WizardStep;
};

function WizardRoot({
  className,
  children,
  completionTitle = "All set",
  completionDescription = "Your responses have been saved and the wizard is complete.",
  initialStep = 0,
  onComplete,
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
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isCompleting, setIsCompleting] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);

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

    setErrorMessage(null);

    const validationResult = await currentStepDefinition.props.validate?.({
      stepIndex: activeStepIndex,
      stepCount: steps.length,
      isFirstStep,
      isLastStep,
    });

    if (validationResult !== undefined && validationResult !== true) {
      setErrorMessage(
        typeof validationResult === "string"
          ? validationResult
          : "Please complete this step before continuing.",
      );
      return;
    }

    if (isLastStep) {
      try {
        setIsCompleting(true);
        await onComplete?.();
        setIsComplete(true);
      } finally {
        setIsCompleting(false);
      }
      return;
    }

    setCurrentStep((previousStep) =>
      Math.min(previousStep + 1, steps.length - 1),
    );
  }

  function handlePrevious() {
    setErrorMessage(null);
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
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {currentStepDefinition.props.title}
        </h1>
      </div>

      {isComplete ? (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>{completionTitle}</AlertTitle>
          <AlertDescription>{completionDescription}</AlertDescription>
        </Alert>
      ) : (
        <>
          {errorMessage ? (
            <Alert variant="destructive">
              <AlertTitle>Informatie onvolledig</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

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
        </>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep || isCompleting}
        >
          <ChevronLeft />
          Vorige
        </Button>

        {!isComplete ? (
          <Button type="button" onClick={handleNext} disabled={isCompleting}>
            {isLastStep ? "Voltooien" : "Volgende"}
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
export type { WizardProps, WizardStepProps, WizardValidationContext };
