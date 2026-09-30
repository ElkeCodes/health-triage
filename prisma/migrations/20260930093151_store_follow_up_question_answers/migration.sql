/*
  Warnings:

  - You are about to drop the column `answerLabel` on the `Questions` table. All the data in the column will be lost.
  - You are about to drop the column `answerValue` on the `Questions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Questions" DROP COLUMN "answerLabel",
DROP COLUMN "answerValue",
ADD COLUMN     "answerValues" TEXT[] DEFAULT ARRAY[]::TEXT[];
