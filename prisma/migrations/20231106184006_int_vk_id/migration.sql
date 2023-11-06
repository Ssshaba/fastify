/*
  Warnings:

  - The `vkId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `vkId` column on the `UserEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "UserEvent" DROP CONSTRAINT "UserEvent_vkId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "vkId",
ADD COLUMN     "vkId" INTEGER;

-- AlterTable
ALTER TABLE "UserEvent" DROP COLUMN "vkId",
ADD COLUMN     "vkId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_vkId_key" ON "User"("vkId");

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_vkId_fkey" FOREIGN KEY ("vkId") REFERENCES "User"("vkId") ON DELETE SET NULL ON UPDATE CASCADE;
