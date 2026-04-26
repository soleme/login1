ALTER TABLE "User" RENAME COLUMN "username" TO "loginId";

ALTER INDEX "User_username_key" RENAME TO "User_loginId_key";
