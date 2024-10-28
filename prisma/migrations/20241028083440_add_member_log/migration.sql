/*
  Warnings:

  - You are about to drop the `QueueItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QueueItem" DROP CONSTRAINT "QueueItem_phaseId_fkey";

-- DropForeignKey
ALTER TABLE "QueueItem" DROP CONSTRAINT "QueueItem_queueId_fkey";

-- DropTable
DROP TABLE "QueueItem";

-- CreateTable
CREATE TABLE "MemberLog" (
    "id" VARCHAR(12) NOT NULL DEFAULT nanoid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastQueueRequestAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueMember" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "queueId" INTEGER NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "logId" VARCHAR(12) NOT NULL,

    CONSTRAINT "QueueMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QueueMember" ADD CONSTRAINT "QueueMember_logId_fkey" FOREIGN KEY ("logId") REFERENCES "MemberLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueMember" ADD CONSTRAINT "QueueMember_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueMember" ADD CONSTRAINT "QueueMember_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
