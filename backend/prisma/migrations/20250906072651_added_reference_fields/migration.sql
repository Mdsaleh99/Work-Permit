-- DropForeignKey
ALTER TABLE "public"."WorkPermitSection" DROP CONSTRAINT "WorkPermitSection_workPermitFormId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkPermitSectionComponent" DROP CONSTRAINT "WorkPermitSectionComponent_workPermitSectionId_fkey";

-- AddForeignKey
ALTER TABLE "public"."WorkPermitSection" ADD CONSTRAINT "WorkPermitSection_workPermitFormId_fkey" FOREIGN KEY ("workPermitFormId") REFERENCES "public"."WorkPermitForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkPermitSectionComponent" ADD CONSTRAINT "WorkPermitSectionComponent_workPermitSectionId_fkey" FOREIGN KEY ("workPermitSectionId") REFERENCES "public"."WorkPermitSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
