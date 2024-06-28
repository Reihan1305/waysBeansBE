/*
  Warnings:

  - You are about to drop the column `cartId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_cartId_fkey";

-- DropIndex
DROP INDEX "Transaction_cartId_key";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "cartId";
