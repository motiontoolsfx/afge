-- CreateTable
CREATE TABLE "Case" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Case_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
