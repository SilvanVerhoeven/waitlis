/*
  Warnings:

  - You are about to drop the column `firstInPhase` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `queueId` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `queueId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_queueId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_queueId_fkey";

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "firstInPhase",
DROP COLUMN "queueId";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "queueId";

-- CreateTable
CREATE TABLE "_QueueToTag" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_QueueToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_QueueToTag_B_index" ON "_QueueToTag"("B");

-- AddForeignKey
ALTER TABLE "_QueueToTag" ADD CONSTRAINT "_QueueToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QueueToTag" ADD CONSTRAINT "_QueueToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE;
