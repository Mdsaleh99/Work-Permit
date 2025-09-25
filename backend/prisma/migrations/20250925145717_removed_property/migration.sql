-- DropForeignKey
ALTER TABLE "public"."WorkPermitSubmission" DROP CONSTRAINT "WorkPermitSubmission_submittedById_fkey";

-- AddForeignKey
ALTER TABLE "public"."WorkPermitSubmission" ADD CONSTRAINT "WorkPermitSubmission_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "public"."CompanyMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
