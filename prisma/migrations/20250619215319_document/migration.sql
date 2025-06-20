/*
  Warnings:

  - You are about to drop the column `file` on the `Case` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Case" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "personalEmail" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "payScale" TEXT NOT NULL,
    "entitlement" TEXT NOT NULL,
    "supervisor" TEXT NOT NULL,
    "reasonForRequest" TEXT NOT NULL,
    "typesOfPayIssue" TEXT,
    "typesOfDisciplinaryAction" TEXT,
    "notes" TEXT,
    "progress" TEXT DEFAULT 'Not_Started',
    "documents" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Case_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Case" ("createdAt", "date", "entitlement", "fname", "id", "lname", "notes", "payScale", "personalEmail", "phoneNumber", "position", "progress", "reasonForRequest", "supervisor", "typesOfDisciplinaryAction", "typesOfPayIssue", "updatedAt", "userId") SELECT "createdAt", "date", "entitlement", "fname", "id", "lname", "notes", "payScale", "personalEmail", "phoneNumber", "position", "progress", "reasonForRequest", "supervisor", "typesOfDisciplinaryAction", "typesOfPayIssue", "updatedAt", "userId" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
