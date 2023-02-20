/*
  Warnings:

  - Made the column `projectId` on table `ProjectResource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `resourceId` on table `ProjectResource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectResourceId` on table `ResourceStartInterval` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProjectResource" DROP CONSTRAINT "ProjectResource_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectResource" DROP CONSTRAINT "ProjectResource_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceStartInterval" DROP CONSTRAINT "ResourceStartInterval_projectResourceId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "hoursAvailable" INTEGER;

-- AlterTable
ALTER TABLE "ProjectResource" ALTER COLUMN "projectId" SET NOT NULL,
ALTER COLUMN "resourceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ResourceStartInterval" ALTER COLUMN "projectResourceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectResource" ADD CONSTRAINT "ProjectResource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResource" ADD CONSTRAINT "ProjectResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceStartInterval" ADD CONSTRAINT "ResourceStartInterval_projectResourceId_fkey" FOREIGN KEY ("projectResourceId") REFERENCES "ProjectResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
