-- CreateEnum
CREATE TYPE "University" AS ENUM ('general', 'donstu');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "university" "University";
