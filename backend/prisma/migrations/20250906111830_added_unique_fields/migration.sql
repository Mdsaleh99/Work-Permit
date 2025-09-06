/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `WorkPermitSection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `WorkPermitSectionComponent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkPermitSection_title_key" ON "public"."WorkPermitSection"("title");

-- CreateIndex
CREATE UNIQUE INDEX "WorkPermitSectionComponent_label_key" ON "public"."WorkPermitSectionComponent"("label");
