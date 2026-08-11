-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_organizacionId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "authProvider" TEXT DEFAULT 'local',
ALTER COLUMN "password_hash" DROP NOT NULL,
ALTER COLUMN "organizacionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
