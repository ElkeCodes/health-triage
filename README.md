# Health Triage

Health Triage is a full-stack medical triage web app that guides patients through a structured symptom intake, helps them narrow down what they’re experiencing, and suggests the most appropriate next step in care.
The experience is designed as a multi-step wizard: users enter basic patient details, select symptoms, answer contextual follow-up questions, review their intake, and submit the triage for processing and storage.
It is meant as a portfolio project because it combines a polished user experience with real backend logic, AI-assisted assistance, and database persistence.

## Technologies used and why

* Next.js 16 + React 19: Used for the app shell, routing, server actions, and API routes. It’s a great fit for a full-stack project because the UI and backend logic live in one codebase.
* TypeScript: Keeps the triage data model, form values, symptom types, and API payloads strongly typed. That matters a lot in a workflow-heavy app where data consistency is important.
* React Hook Form + Zod: Enables the use of a multi-step form with validation. This gives the wizard a clean UX while enforcing structured input before submission.
* Prisma ORM + PostgreSQL: Used to persist triage submissions and follow-up answers. Prisma makes the data layer type-safe and easy to evolve, while PostgreSQL gives the app a reliable relational backend.
* Mastra + OpenAI: Drives the AI-assisted symptom suggestion engine. This adds intelligent, context-aware symptom recommendations based on selected symptoms, search terms, and follow-up answers.
* Tailwind CSS + shadcn-style reusable UI components + Lucide icons: Used to create a clean, accessible interface quickly, without sacrificing consistency or responsiveness.

## Deployment

It is meant to be deployed on Vercel with the database deployed on Neon

## Key features

* Multi-step triage wizard: A guided intake flow that keeps the experience simple and structured.
* Symptom search and selection: Users can search a symptom list, select multiple symptoms, and refine their intake.
* AI-assisted symptom suggestions: The app suggests relevant next symptoms dynamically, based on the current context. If the AI is unavailable, it returns back fallback data
* Adaptive follow-up questions: Each symptom can trigger chained follow-up questions to capture more detail and improve triage quality such as defining where on your chest you have chest pain.
* Urgency scoring and care guidance: Selected symptoms are used to determine urgency and recommend the next care step.
* Specialty routing: The app suggests the most relevant medical specialty based on the symptom profile. This is done deterministically by linking symptoms to specialities with added weights for the urgency.
* Review screen before submission: Users can verify all details, including follow-up answers, before sending the triage.
* Database persistence: Triage records and follow-up questions are stored for later retrieval and review.
* Emergency warning on the landing page: A clear safety notice directs users to urgent help when necessary.
