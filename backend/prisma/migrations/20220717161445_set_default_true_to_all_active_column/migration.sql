-- AlterTable
ALTER TABLE "match_has_users" ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "room_has_users" ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "active" SET DEFAULT true;
