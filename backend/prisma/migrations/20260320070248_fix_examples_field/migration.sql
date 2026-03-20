/*
  Warnings:

  - You are about to drop the column `codesnippets` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `example` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `refererenceSolution` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `codeSnippets` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examples` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refererenceSolutions` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `difficulty` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "codesnippets",
DROP COLUMN "example",
DROP COLUMN "refererenceSolution",
ADD COLUMN     "codeSnippets" JSONB NOT NULL,
ADD COLUMN     "examples" JSONB NOT NULL,
ADD COLUMN     "refererenceSolutions" JSONB NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL;

-- DropEnum
DROP TYPE "Dificulty";
