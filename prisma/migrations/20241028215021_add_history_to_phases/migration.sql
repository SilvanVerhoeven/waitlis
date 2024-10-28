/*
  Warnings:

  - A unique constraint covering the columns `[previousId]` on the table `Phase` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Phase" ADD COLUMN     "previousId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Phase_previousId_key" ON "Phase"("previousId");

-- AddForeignKey
ALTER TABLE "Phase" ADD CONSTRAINT "Phase_previousId_fkey" FOREIGN KEY ("previousId") REFERENCES "Phase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
