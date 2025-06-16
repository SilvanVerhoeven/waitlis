/*
  Warnings:

  - Added the required column `secret` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "secret" TEXT NOT NULL;
