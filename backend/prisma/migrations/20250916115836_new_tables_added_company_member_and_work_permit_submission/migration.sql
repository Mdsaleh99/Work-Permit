-- CreateEnum
CREATE TYPE "public"."CompanyMemberRole" AS ENUM ('COMPANY_MEMBER');

-- CreateTable
CREATE TABLE "public"."CompanyMember" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "role" "public"."CompanyMemberRole" NOT NULL DEFAULT 'COMPANY_MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkPermitSubmission" (
    "id" TEXT NOT NULL,
    "workPermitFormId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "submittedById" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkPermitSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyMember_email_key" ON "public"."CompanyMember"("email");

-- CreateIndex
CREATE INDEX "CompanyMember_companyId_idx" ON "public"."CompanyMember"("companyId");

-- CreateIndex
CREATE INDEX "WorkPermitSubmission_workPermitFormId_idx" ON "public"."WorkPermitSubmission"("workPermitFormId");

-- CreateIndex
CREATE INDEX "WorkPermitSubmission_companyId_idx" ON "public"."WorkPermitSubmission"("companyId");

-- CreateIndex
CREATE INDEX "WorkPermitSubmission_submittedById_idx" ON "public"."WorkPermitSubmission"("submittedById");

-- AddForeignKey
ALTER TABLE "public"."CompanyMember" ADD CONSTRAINT "CompanyMember_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkPermitSubmission" ADD CONSTRAINT "WorkPermitSubmission_workPermitFormId_fkey" FOREIGN KEY ("workPermitFormId") REFERENCES "public"."WorkPermitForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkPermitSubmission" ADD CONSTRAINT "WorkPermitSubmission_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkPermitSubmission" ADD CONSTRAINT "WorkPermitSubmission_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
