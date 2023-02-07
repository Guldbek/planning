/*
  Warnings:

  - You are about to drop the column `projectId` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `resourceId` on the `ResourceStartInterval` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceStartInterval" DROP CONSTRAINT "ResourceStartInterval_resourceId_fkey";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "ResourceStartInterval" DROP COLUMN "resourceId",
ADD COLUMN     "projectResourceId" INTEGER;

-- CreateTable
CREATE TABLE "ProjectResource" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER,
    "resourceId" INTEGER,
    "projectResourceId" INTEGER,

    CONSTRAINT "ProjectResource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectResource" ADD CONSTRAINT "ProjectResource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResource" ADD CONSTRAINT "ProjectResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceStartInterval" ADD CONSTRAINT "ResourceStartInterval_projectResourceId_fkey" FOREIGN KEY ("projectResourceId") REFERENCES "ProjectResource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
