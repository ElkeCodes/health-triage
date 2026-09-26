/*
  Warnings:

  - Added the required column `consultationType` to the `Triage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `next` to the `Triage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pathway` to the `Triage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urgency` to the `Triage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Triage" ADD COLUMN     "consultationType" TEXT NOT NULL,
ADD COLUMN     "next" TEXT NOT NULL,
ADD COLUMN     "pathway" TEXT NOT NULL,
ADD COLUMN     "urgency" TEXT NOT NULL;
