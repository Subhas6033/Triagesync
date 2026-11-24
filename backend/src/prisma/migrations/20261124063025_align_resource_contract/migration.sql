/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Resource` MODIFY `description` VARCHAR(300) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Resource_name_key` ON `Resource`(`name`);
