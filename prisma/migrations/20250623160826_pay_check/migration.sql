/*
  Warnings:

  - The values [Pay_check] on the enum `PayIssueType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PayIssueType_new" AS ENUM ('Indebtedness', 'Pay_Check');
ALTER TABLE "Case" ALTER COLUMN "typesOfPayIssue" TYPE "PayIssueType_new" USING ("typesOfPayIssue"::text::"PayIssueType_new");
ALTER TYPE "PayIssueType" RENAME TO "PayIssueType_old";
ALTER TYPE "PayIssueType_new" RENAME TO "PayIssueType";
DROP TYPE "PayIssueType_old";
COMMIT;
