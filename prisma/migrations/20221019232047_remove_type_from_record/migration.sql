/*
  Warnings:

  - You are about to drop the column `type` on the `Record` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Record" DROP COLUMN "type";

-- DropEnum
DROP TYPE "RecordCategory";
