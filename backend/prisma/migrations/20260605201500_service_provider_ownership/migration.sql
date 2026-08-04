-- AlterTable
ALTER TABLE "Service" ADD COLUMN "providerId" TEXT;

-- CreateIndex
CREATE INDEX "Service_providerId_idx" ON "Service"("providerId");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
