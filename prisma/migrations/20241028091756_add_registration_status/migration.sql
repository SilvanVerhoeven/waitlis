/*
  Warnings:

  - Added the required column `status` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('ACTIVE', 'SKIPPED');

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "status" "RegistrationStatus" NOT NULL;
