-- CreateEnum
CREATE TYPE "public"."LoginType" AS ENUM ('GOOGLE', 'MICROSOFT', 'EMAIL_PASSWORD');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "loginType" "public"."LoginType" NOT NULL DEFAULT 'EMAIL_PASSWORD';
