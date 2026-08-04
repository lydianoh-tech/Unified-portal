-- AlterTable
ALTER TABLE "Service" ADD COLUMN "department" TEXT;

-- AlterTable
ALTER TABLE "Listing"
ADD COLUMN "department" TEXT,
ADD COLUMN "category" TEXT,
ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
