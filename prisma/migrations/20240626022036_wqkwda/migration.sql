/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Address` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `Phone` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `ProductId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `UserId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `address` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Transaction` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `phone` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_ProductId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_UserId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "Address",
DROP COLUMN "Phone",
DROP COLUMN "ProductId",
DROP COLUMN "UserId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ProductTransaction" (
    "productId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "ProductTransaction_pkey" PRIMARY KEY ("productId","transactionId")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTransaction" ADD CONSTRAINT "ProductTransaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTransaction" ADD CONSTRAINT "ProductTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
