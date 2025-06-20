-- CreateEnum
CREATE TYPE "Role" AS ENUM ('owner', 'admin', 'steward');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('Nurse', 'MAS', 'FMS', 'EMS', 'HIMS', 'Doctor', 'Tech', 'LPN', 'Social_Work', 'Dentist', 'Dental_Assistant', 'Other');

-- CreateEnum
CREATE TYPE "PayScale" AS ENUM ('GS', 'WG', 'VN');

-- CreateEnum
CREATE TYPE "Entitlement" AS ENUM ('Title_38', 'Title_5', 'Hybrid', 'Unknown');

-- CreateEnum
CREATE TYPE "ReasonForRequest" AS ENUM ('Fact_Finding', 'Pay_Issues', 'Performance_Appraisal', 'EEO', 'Grievance', 'Change_in_Working_Condition', 'Reasonable_Accommodation_RA', 'Workers_Compensation', 'Disciplinary_Action', 'Other');

-- CreateEnum
CREATE TYPE "PayIssueType" AS ENUM ('Indebtedness', 'Pay_check');

-- CreateEnum
CREATE TYPE "DisciplinaryActionType" AS ENUM ('Verbal_Counseling', 'Written_Counseling', 'Admonishment', 'Reprimand', 'Proposed_Suspension', 'Proposed_Removal');

-- CreateEnum
CREATE TYPE "Progress" AS ENUM ('Not_Started', 'In_Progress', 'Meeting_Set', 'Awaiting_Response', 'Esculated', 'Complete');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "personalEmail" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "position" "Position" NOT NULL,
    "payScale" "PayScale" NOT NULL,
    "entitlement" "Entitlement" NOT NULL,
    "supervisor" TEXT NOT NULL,
    "reasonForRequest" "ReasonForRequest" NOT NULL,
    "typesOfPayIssue" "PayIssueType",
    "typesOfDisciplinaryAction" "DisciplinaryActionType",
    "notes" TEXT,
    "progress" "Progress" DEFAULT 'Not_Started',
    "documents" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
