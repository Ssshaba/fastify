-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "pointValue" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "group" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "points" INTEGER,
ALTER COLUMN "email" DROP NOT NULL;
