/*
  Warnings:

  - Added the required column `queueId` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "queueId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Lane" (
    "id" SERIAL NOT NULL,
    "condition" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mergeId" INTEGER,

    CONSTRAINT "Lane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Segment" (
    "id" SERIAL NOT NULL,
    "condition" TEXT NOT NULL,
    "laneId" INTEGER NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merge" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Merge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lane" ADD CONSTRAINT "Lane_mergeId_fkey" FOREIGN KEY ("mergeId") REFERENCES "Merge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_laneId_fkey" FOREIGN KEY ("laneId") REFERENCES "Lane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
