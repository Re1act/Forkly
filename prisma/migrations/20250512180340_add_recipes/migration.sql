/*
  Warnings:

  - You are about to drop the `SavedRecipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SavedRecipe" DROP CONSTRAINT "SavedRecipe_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "SavedRecipe" DROP CONSTRAINT "SavedRecipe_userId_fkey";

-- DropTable
DROP TABLE "SavedRecipe";

-- CreateTable
CREATE TABLE "SavedRecipes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedRecipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedRecipes_userId_recipeId_key" ON "SavedRecipes"("userId", "recipeId");

-- AddForeignKey
ALTER TABLE "SavedRecipes" ADD CONSTRAINT "SavedRecipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRecipes" ADD CONSTRAINT "SavedRecipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
