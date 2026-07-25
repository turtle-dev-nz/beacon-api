/*
  Warnings:

  - Added the required column `updatedAt` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "address" TEXT,
ADD COLUMN     "cardColors" TEXT[],
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "linkedIn" TEXT,
ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "rawOcrText" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "title" TEXT,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "website" TEXT;
