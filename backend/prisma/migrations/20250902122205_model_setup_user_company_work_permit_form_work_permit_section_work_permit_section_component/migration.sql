-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."WorkPermitComponentType" AS ENUM ('text', 'checkbox', 'radio', 'textarea', 'date', 'time');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'ADMIN',
    "verifyCode" TEXT,
    "verifyCodeExpiry" TIMESTAMP(3),
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "compName" TEXT NOT NULL,
    "description" TEXT,
    "email" TEXT NOT NULL,
    "mobileNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkPermitForm" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "formUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkPermitForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkPermitSection" (
    "id" TEXT NOT NULL,
    "workPermitFormId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkPermitSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkPermitSectionComponent" (
    "id" TEXT NOT NULL,
    "workPermitSectionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "public"."WorkPermitComponentType" NOT NULL DEFAULT 'text',
    "required" BOOLEAN NOT NULL DEFAULT true,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkPermitSectionComponent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_compName_key" ON "public"."Company"("compName");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "public"."Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_mobileNo_key" ON "public"."Company"("mobileNo");

-- CreateIndex
CREATE INDEX "WorkPermitForm_userId_idx" ON "public"."WorkPermitForm"("userId");

-- CreateIndex
CREATE INDEX "WorkPermitForm_companyId_idx" ON "public"."WorkPermitForm"("companyId");

-- CreateIndex
CREATE INDEX "WorkPermitSection_workPermitFormId_idx" ON "public"."WorkPermitSection"("workPermitFormId");

-- CreateIndex
CREATE INDEX "WorkPermitSectionComponent_workPermitSectionId_idx" ON "public"."WorkPermitSectionComponent"("workPermitSectionId");

-- AddForeignKey
ALTER TABLE "public"."Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkPermitForm" ADD CONSTRAINT "WorkPermitForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkPermitForm" ADD CONSTRAINT "WorkPermitForm_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkPermitSection" ADD CONSTRAINT "WorkPermitSection_workPermitFormId_fkey" FOREIGN KEY ("workPermitFormId") REFERENCES "public"."WorkPermitForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkPermitSectionComponent" ADD CONSTRAINT "WorkPermitSectionComponent_workPermitSectionId_fkey" FOREIGN KEY ("workPermitSectionId") REFERENCES "public"."WorkPermitSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
