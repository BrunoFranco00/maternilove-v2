-- CreateEnum
CREATE TYPE "PregnancyStage" AS ENUM ('TRYING', 'PREGNANT', 'POSTPARTUM', 'HAS_CHILD');

-- CreateEnum
CREATE TYPE "PregnancyType" AS ENUM ('SINGLE', 'TWINS', 'MULTIPLE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ChildSex" AS ENUM ('FEMALE', 'MALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ContentFocus" AS ENUM ('PREGNANCY', 'NEWBORN', 'TODDLER_1_2', 'TODDLER_3_5', 'POSTPARTUM', 'GENERAL');

-- CreateEnum
CREATE TYPE "RiskFlag" AS ENUM ('DIABETES', 'HYPERTENSION', 'THYROID', 'ANEMIA', 'DEPRESSION', 'ANXIETY', 'OTHER');

-- CreateTable
CREATE TABLE "MaternalProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stage" "PregnancyStage" NOT NULL DEFAULT 'HAS_CHILD',
    "dueDate" TIMESTAMP(3),
    "lastMenstrualPeriod" TIMESTAMP(3),
    "gestationalWeek" INTEGER,
    "gestationalDay" INTEGER,
    "pregnancyType" "PregnancyType",
    "isHighRisk" BOOLEAN,
    "riskFlags" "RiskFlag"[] DEFAULT ARRAY[]::"RiskFlag"[],
    "preferredContentFocus" "ContentFocus"[] DEFAULT ARRAY[]::"ContentFocus"[],
    "locale" TEXT,
    "timeZone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaternalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaternalPersonalData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "phone" TEXT,
    "cpf" TEXT,
    "birthDate" TIMESTAMP(3),
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaternalPersonalData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaternalAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postalCode" TEXT,
    "street" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaternalAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaternalHealth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conditions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "medications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allergies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hasPrenatalCare" BOOLEAN,
    "prenatalCareNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaternalHealth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaternalLifestyle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sleepQuality" INTEGER,
    "activityLevel" INTEGER,
    "nutritionFocus" TEXT,
    "supplements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaternalLifestyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaternalEmotional" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "baselineMood" "MoodType",
    "stressLevel" INTEGER,
    "supportNetwork" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaternalEmotional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "childName" TEXT,
    "childSex" "ChildSex",
    "birthDate" TIMESTAMP(3),
    "ageMonths" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MaternalProfile_userId_key" ON "MaternalProfile"("userId");

-- CreateIndex
CREATE INDEX "MaternalProfile_userId_idx" ON "MaternalProfile"("userId");

-- CreateIndex
CREATE INDEX "MaternalProfile_stage_idx" ON "MaternalProfile"("stage");

-- CreateIndex
CREATE INDEX "MaternalProfile_createdAt_idx" ON "MaternalProfile"("createdAt");

-- CreateIndex
CREATE INDEX "MaternalProfile_updatedAt_idx" ON "MaternalProfile"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MaternalPersonalData_userId_key" ON "MaternalPersonalData"("userId");

-- CreateIndex
CREATE INDEX "MaternalPersonalData_userId_idx" ON "MaternalPersonalData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MaternalAddress_userId_key" ON "MaternalAddress"("userId");

-- CreateIndex
CREATE INDEX "MaternalAddress_userId_idx" ON "MaternalAddress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MaternalHealth_userId_key" ON "MaternalHealth"("userId");

-- CreateIndex
CREATE INDEX "MaternalHealth_userId_idx" ON "MaternalHealth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MaternalLifestyle_userId_key" ON "MaternalLifestyle"("userId");

-- CreateIndex
CREATE INDEX "MaternalLifestyle_userId_idx" ON "MaternalLifestyle"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MaternalEmotional_userId_key" ON "MaternalEmotional"("userId");

-- CreateIndex
CREATE INDEX "MaternalEmotional_userId_idx" ON "MaternalEmotional"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildProfile_userId_key" ON "ChildProfile"("userId");

-- CreateIndex
CREATE INDEX "ChildProfile_userId_idx" ON "ChildProfile"("userId");

-- AddForeignKey
ALTER TABLE "MaternalProfile" ADD CONSTRAINT "MaternalProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaternalPersonalData" ADD CONSTRAINT "MaternalPersonalData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaternalAddress" ADD CONSTRAINT "MaternalAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaternalHealth" ADD CONSTRAINT "MaternalHealth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaternalLifestyle" ADD CONSTRAINT "MaternalLifestyle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaternalEmotional" ADD CONSTRAINT "MaternalEmotional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildProfile" ADD CONSTRAINT "ChildProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
