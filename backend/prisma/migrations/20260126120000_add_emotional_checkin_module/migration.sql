-- CreateEnum
CREATE TYPE "MoodType" AS ENUM ('HAPPY', 'CALM', 'TIRED', 'ANXIOUS', 'SAD', 'OVERWHELMED');

-- CreateTable
CREATE TABLE "EmotionalCheckin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mood" "MoodType" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmotionalCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmotionalCheckin_userId_idx" ON "EmotionalCheckin"("userId");

-- CreateIndex
CREATE INDEX "EmotionalCheckin_createdAt_idx" ON "EmotionalCheckin"("createdAt");

-- AddForeignKey
ALTER TABLE "EmotionalCheckin" ADD CONSTRAINT "EmotionalCheckin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
