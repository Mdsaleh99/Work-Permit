-- DropIndex
DROP INDEX "public"."WorkPermitSection_title_key";

-- CreateTable
CREATE TABLE "public"."WorkPermitDraft" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "isAutoSave" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkPermitDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkPermitDraftSection" (
    "id" TEXT NOT NULL,
    "workPermitDraftId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkPermitDraftSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkPermitDraftComponent" (
    "id" TEXT NOT NULL,
    "workPermitDraftSectionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "public"."WorkPermitComponentType" NOT NULL DEFAULT 'text',
    "required" BOOLEAN NOT NULL DEFAULT true,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkPermitDraftComponent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkPermitDraft_userId_idx" ON "public"."WorkPermitDraft"("userId");

-- CreateIndex
CREATE INDEX "WorkPermitDraft_companyId_idx" ON "public"."WorkPermitDraft"("companyId");

-- CreateIndex
CREATE INDEX "WorkPermitDraftSection_workPermitDraftId_idx" ON "public"."WorkPermitDraftSection"("workPermitDraftId");

-- CreateIndex
CREATE INDEX "WorkPermitDraftComponent_workPermitDraftSectionId_idx" ON "public"."WorkPermitDraftComponent"("workPermitDraftSectionId");

-- AddForeignKey
ALTER TABLE "public"."WorkPermitDraft" ADD CONSTRAINT "WorkPermitDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkPermitDraft" ADD CONSTRAINT "WorkPermitDraft_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkPermitDraftSection" ADD CONSTRAINT "WorkPermitDraftSection_workPermitDraftId_fkey" FOREIGN KEY ("workPermitDraftId") REFERENCES "public"."WorkPermitDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkPermitDraftComponent" ADD CONSTRAINT "WorkPermitDraftComponent_workPermitDraftSectionId_fkey" FOREIGN KEY ("workPermitDraftSectionId") REFERENCES "public"."WorkPermitDraftSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
