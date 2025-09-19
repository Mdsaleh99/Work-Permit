/*
  Warnings:

  - A unique constraint covering the columns `[workPermitNo]` on the table `WorkPermitForm` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."WorkPermitForm" ADD COLUMN     "workPermitNo" VARCHAR(12);

-- CreateIndex
CREATE UNIQUE INDEX "WorkPermitForm_workPermitNo_key" ON "public"."WorkPermitForm"("workPermitNo");
