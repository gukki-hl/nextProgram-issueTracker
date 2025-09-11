/*
  Warnings:

  - The primary key for the `verification_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `verification_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identifier,token]` on the table `verification_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `verification_tokens_token_key` ON `verification_tokens`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `hashed_password` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `verification_tokens` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- CreateIndex
CREATE UNIQUE INDEX `verification_tokens_identifier_token_key` ON `verification_tokens`(`identifier`, `token`);
