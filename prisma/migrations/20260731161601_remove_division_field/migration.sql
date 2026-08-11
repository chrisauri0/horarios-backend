/*
  Warnings:

  - You are about to drop the column `division` on the `grupos` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `salones` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "grupos" DROP COLUMN "division";

-- AlterTable
ALTER TABLE "salones" DROP COLUMN "division";
