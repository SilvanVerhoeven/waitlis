/*
  Warnings:

  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_QueueToTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_RegistrationToTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `B` on the `_QueueToTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_RegistrationToTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_QueueToTag" DROP CONSTRAINT "_QueueToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "_RegistrationToTag" DROP CONSTRAINT "_RegistrationToTag_B_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_QueueToTag" DROP CONSTRAINT "_QueueToTag_AB_pkey",
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL,
ADD CONSTRAINT "_QueueToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "_RegistrationToTag" DROP CONSTRAINT "_RegistrationToTag_AB_pkey",
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL,
ADD CONSTRAINT "_RegistrationToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateIndex
CREATE INDEX "_QueueToTag_B_index" ON "_QueueToTag"("B");

-- CreateIndex
CREATE INDEX "_RegistrationToTag_B_index" ON "_RegistrationToTag"("B");

-- AddForeignKey
ALTER TABLE "_QueueToTag" ADD CONSTRAINT "_QueueToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RegistrationToTag" ADD CONSTRAINT "_RegistrationToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
