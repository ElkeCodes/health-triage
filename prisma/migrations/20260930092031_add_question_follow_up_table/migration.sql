-- CreateTable
CREATE TABLE "Questions" (
    "id" SERIAL NOT NULL,
    "triageId" INTEGER NOT NULL,
    "symptomName" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "answerValue" TEXT NOT NULL,
    "answerLabel" TEXT NOT NULL,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "askedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answeredAt" TIMESTAMP(3),

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Questions_triageId_idx" ON "Questions"("triageId");

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_triageId_fkey" FOREIGN KEY ("triageId") REFERENCES "Triage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
