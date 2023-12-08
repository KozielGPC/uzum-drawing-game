-- DropForeignKey
ALTER TABLE "rounds" DROP CONSTRAINT "rounds_receiver_id_fkey";

-- AlterTable
ALTER TABLE "rounds" ALTER COLUMN "receiver_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
