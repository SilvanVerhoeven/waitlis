/*
  Warnings:

  - You are about to drop the `MemberLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QueueMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QueueMember" DROP CONSTRAINT "QueueMember_logId_fkey";

-- DropForeignKey
ALTER TABLE "QueueMember" DROP CONSTRAINT "QueueMember_phaseId_fkey";

-- DropForeignKey
ALTER TABLE "QueueMember" DROP CONSTRAINT "QueueMember_queueId_fkey";

-- DropTable
DROP TABLE "MemberLog";

-- DropTable
DROP TABLE "QueueMember";

-- CreateTable
CREATE TABLE "Member" (
    "id" VARCHAR(12) NOT NULL DEFAULT nanoid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastRegistrationAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "queueId" INTEGER NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "memberId" VARCHAR(12) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
