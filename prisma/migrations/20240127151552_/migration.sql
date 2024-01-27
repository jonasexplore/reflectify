/*
  Warnings:

  - Added the required column `boardId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardId` to the `cards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `cards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardId` to the `comments_likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardId` to the `cards_likes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    CONSTRAINT "comments_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("cardId", "content", "id", "timestamp", "userId") SELECT "cardId", "content", "id", "timestamp", "userId" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
CREATE TABLE "new_cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    CONSTRAINT "cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cards_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cards_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "columns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cards" ("columnId", "content", "id") SELECT "columnId", "content", "id" FROM "cards";
DROP TABLE "cards";
ALTER TABLE "new_cards" RENAME TO "cards";
CREATE TABLE "new_comments_likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    CONSTRAINT "comments_likes_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_comments_likes" ("commentId", "id", "timestamp", "userId") SELECT "commentId", "id", "timestamp", "userId" FROM "comments_likes";
DROP TABLE "comments_likes";
ALTER TABLE "new_comments_likes" RENAME TO "comments_likes";
CREATE TABLE "new_cards_likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    CONSTRAINT "cards_likes_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cards_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cards_likes_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cards_likes" ("cardId", "id", "timestamp", "userId") SELECT "cardId", "id", "timestamp", "userId" FROM "cards_likes";
DROP TABLE "cards_likes";
ALTER TABLE "new_cards_likes" RENAME TO "cards_likes";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
