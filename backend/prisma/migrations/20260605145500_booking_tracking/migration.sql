-- CreateEnum
CREATE TYPE "BookingTrackingStage" AS ENUM ('ACCEPTED', 'REJECTED', 'ON_THE_WAY', 'ARRIVED', 'STARTED', 'MIDWAY', 'FINISHED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "currentLat" DECIMAL(10,7),
ADD COLUMN     "currentLng" DECIMAL(10,7),
ADD COLUMN     "currentStage" "BookingTrackingStage",
ADD COLUMN     "locationUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "rejectedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BookingProgressUpdate" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "stage" "BookingTrackingStage" NOT NULL,
    "note" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "evidenceUrls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingProgressUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingProgressUpdate_bookingId_createdAt_idx" ON "BookingProgressUpdate"("bookingId", "createdAt");

-- AddForeignKey
ALTER TABLE "BookingProgressUpdate" ADD CONSTRAINT "BookingProgressUpdate_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingProgressUpdate" ADD CONSTRAINT "BookingProgressUpdate_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
