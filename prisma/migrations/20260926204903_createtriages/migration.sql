-- CreateTable
CREATE TABLE "Triage" (
    "id" SERIAL NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "symptoms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Triage_pkey" PRIMARY KEY ("id")
);
