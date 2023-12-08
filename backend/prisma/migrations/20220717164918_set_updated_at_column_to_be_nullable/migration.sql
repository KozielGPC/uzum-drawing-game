-- AlterTable
ALTER TABLE "match_has_users" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "matches" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "room_has_users" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "rounds" ADD COLUMN     "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" DATE;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL;
