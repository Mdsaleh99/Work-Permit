-- CreateEnum
CREATE TYPE "public"."WorkPermitFormStatus" AS ENUM ('PENDING', 'APPROVED', 'CANCELLED', 'CLOSED');

-- AlterTable
ALTER TABLE "public"."WorkPermitForm" ADD COLUMN     "status" "public"."WorkPermitFormStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "public"."_CompanyMemberToWorkPermitForm" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompanyMemberToWorkPermitForm_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompanyMemberToWorkPermitForm_B_index" ON "public"."_CompanyMemberToWorkPermitForm"("B");

-- AddForeignKey
ALTER TABLE "public"."_CompanyMemberToWorkPermitForm" ADD CONSTRAINT "_CompanyMemberToWorkPermitForm_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."CompanyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CompanyMemberToWorkPermitForm" ADD CONSTRAINT "_CompanyMemberToWorkPermitForm_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."WorkPermitForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
