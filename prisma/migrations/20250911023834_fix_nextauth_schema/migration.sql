/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `verification_tokens` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `verification_tokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `verification_tokens_identifier_token_key` ON `verification_tokens`;

-- AlterTable
ALTER TABLE `verification_tokens` ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `verification_tokens_token_key` ON `verification_tokens`(`token`);
