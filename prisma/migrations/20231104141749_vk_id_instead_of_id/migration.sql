/*
  Warnings:

  - You are about to drop the column `userId` on the `UserEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserEvent" DROP CONSTRAINT "UserEvent_userId_fkey";

-- AlterTable
ALTER TABLE "UserEvent" DROP COLUMN "userId",
ADD COLUMN     "vkId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_vkId_key" ON "User"("vkId");

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_vkId_fkey" FOREIGN KEY ("vkId") REFERENCES "User"("vkId") ON DELETE SET NULL ON UPDATE CASCADE;
