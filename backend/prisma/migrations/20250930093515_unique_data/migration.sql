/*
  Warnings:

  - A unique constraint covering the columns `[workPermitFormId,submittedById]` on the table `WorkPermitSubmission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkPermitSubmission_workPermitFormId_submittedById_key" ON "public"."WorkPermitSubmission"("workPermitFormId", "submittedById");
