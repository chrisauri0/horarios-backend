-- AlterTable
ALTER TABLE "inscripciones_tdi" ADD COLUMN     "nota_alumno" TEXT;

-- AlterTable
ALTER TABLE "tdis" ADD COLUMN     "cupo_actual" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cupo_maximo" INTEGER,
ADD COLUMN     "emoji" TEXT,
ADD COLUMN     "fecha" TIMESTAMP(3),
ADD COLUMN     "lugar" TEXT;
