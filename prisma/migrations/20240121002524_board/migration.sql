/*
  Warnings:

  - You are about to drop the `Board` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Board";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "boards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    CONSTRAINT "boards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "columns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "columns_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
