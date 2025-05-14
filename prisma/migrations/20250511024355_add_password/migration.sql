/*
  Warnings:

  - A unique constraint covering the columns `[hashedPassword]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hashedPassword" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_hashedPassword_key" ON "User"("hashedPassword");
