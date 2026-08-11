-- CreateEnum
CREATE TYPE "EstadoJustificante" AS ENUM ('pendiente', 'aceptado', 'rechazado');

-- CreateTable
CREATE TABLE "Organizacion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carreras" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "data" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "grado" INTEGER NOT NULL,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "carreras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "grado" INTEGER NOT NULL,
    "carrera" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "data" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "grupos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombregrupo" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios_profes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "horarios_profes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materias" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "carrera" TEXT NOT NULL,
    "grado" INTEGER NOT NULL,
    "data" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "horas_semana" INTEGER NOT NULL,
    "salones" JSONB DEFAULT '[]',
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "materias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profesores" (
    "profesor_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "can_be_tutor" BOOLEAN DEFAULT false,
    "materias" JSONB DEFAULT '[]',
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "disponibilidad" JSONB,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "profesores_pkey" PRIMARY KEY ("profesor_id")
);

-- CreateTable
CREATE TABLE "salones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "data" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "division" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "salones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT,
    "role" TEXT DEFAULT 'user',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB DEFAULT '{}',
    "activo" BOOLEAN DEFAULT true,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen_url" TEXT,
    "creator_id" UUID NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "expires_at" TIMESTAMPTZ(6),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_reactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "psicologos" (
    "psicologo_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "disponibilidad" JSONB NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "psicologos_pkey" PRIMARY KEY ("psicologo_id")
);

-- CreateTable
CREATE TABLE "talleres" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "talleres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones_taller" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "taller_id" UUID NOT NULL,
    "alumno_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "inscripciones_taller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tdis" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "eje" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "persona_encargada" TEXT NOT NULL,
    "puesto" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "extension" TEXT,
    "correo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "horas_requeridas" INTEGER NOT NULL,
    "nivel_de_impacto" TEXT NOT NULL,
    "tdis_por_ganar" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "competencias" TEXT NOT NULL,
    "evidencias" TEXT NOT NULL,
    "observaciones" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "tdis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_validacion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "matricula" TEXT NOT NULL,
    "nombre_solicitud" TEXT NOT NULL,
    "correo_alumno" TEXT NOT NULL,
    "eje" TEXT NOT NULL,
    "persona_encargada" TEXT NOT NULL,
    "puesto" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "extension" TEXT,
    "correo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "horas_requeridas" INTEGER NOT NULL,
    "nivel_de_impacto" TEXT NOT NULL,
    "tdis_por_ganar" INTEGER NOT NULL,
    "competencias" TEXT NOT NULL,
    "evidencias" TEXT NOT NULL,
    "observaciones" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "solicitudes_validacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones_tdi" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tdi_id" UUID NOT NULL,
    "alumno_id" UUID NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'inscrito',
    "evidencia_url" TEXT,
    "comentario_admin" TEXT,
    "fecha_inscripcion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_finalizacion" TIMESTAMPTZ(6),
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "inscripciones_tdi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "justificantes" (
    "motivo" TEXT NOT NULL,
    "comentarioAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "driveUrl" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoJustificante" NOT NULL DEFAULT 'pendiente',
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuarioId" UUID NOT NULL,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "justificantes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organizacion_nombre_key" ON "Organizacion"("nombre");

-- CreateIndex
CREATE INDEX "carreras_organizacionId_idx" ON "carreras"("organizacionId");

-- CreateIndex
CREATE INDEX "grupos_organizacionId_idx" ON "grupos"("organizacionId");

-- CreateIndex
CREATE INDEX "horarios_organizacionId_idx" ON "horarios"("organizacionId");

-- CreateIndex
CREATE INDEX "horarios_profes_organizacionId_idx" ON "horarios_profes"("organizacionId");

-- CreateIndex
CREATE INDEX "materias_organizacionId_idx" ON "materias"("organizacionId");

-- CreateIndex
CREATE INDEX "profesores_organizacionId_idx" ON "profesores"("organizacionId");

-- CreateIndex
CREATE INDEX "salones_organizacionId_idx" ON "salones"("organizacionId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_organizacionId_idx" ON "users"("organizacionId");

-- CreateIndex
CREATE INDEX "posts_organizacionId_idx" ON "posts"("organizacionId");

-- CreateIndex
CREATE INDEX "idx_posts_created_at" ON "posts"("created_at");

-- CreateIndex
CREATE INDEX "idx_posts_expires_at" ON "posts"("expires_at");

-- CreateIndex
CREATE INDEX "idx_posts_score_created_at" ON "posts"("score", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "unique_post_user" ON "post_reactions"("post_id", "user_id");

-- CreateIndex
CREATE INDEX "psicologos_organizacionId_idx" ON "psicologos"("organizacionId");

-- CreateIndex
CREATE INDEX "talleres_organizacionId_idx" ON "talleres"("organizacionId");

-- CreateIndex
CREATE INDEX "inscripciones_taller_organizacionId_idx" ON "inscripciones_taller"("organizacionId");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_taller_taller_id_alumno_id_key" ON "inscripciones_taller"("taller_id", "alumno_id");

-- CreateIndex
CREATE INDEX "tdis_organizacionId_idx" ON "tdis"("organizacionId");

-- CreateIndex
CREATE INDEX "solicitudes_validacion_organizacionId_idx" ON "solicitudes_validacion"("organizacionId");

-- CreateIndex
CREATE INDEX "inscripciones_tdi_organizacionId_idx" ON "inscripciones_tdi"("organizacionId");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_tdi_tdi_id_alumno_id_key" ON "inscripciones_tdi"("tdi_id", "alumno_id");

-- CreateIndex
CREATE INDEX "justificantes_organizacionId_idx" ON "justificantes"("organizacionId");

-- AddForeignKey
ALTER TABLE "carreras" ADD CONSTRAINT "carreras_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupos" ADD CONSTRAINT "grupos_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios_profes" ADD CONSTRAINT "horarios_profes_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materias" ADD CONSTRAINT "materias_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesores" ADD CONSTRAINT "profesores_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salones" ADD CONSTRAINT "salones_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "fk_posts_creator" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "fk_comments_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "fk_comments_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "fk_reactions_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "fk_reactions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "psicologos" ADD CONSTRAINT "psicologos_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talleres" ADD CONSTRAINT "talleres_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_taller" ADD CONSTRAINT "inscripciones_taller_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_taller" ADD CONSTRAINT "inscripciones_taller_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_taller" ADD CONSTRAINT "inscripciones_taller_taller_id_fkey" FOREIGN KEY ("taller_id") REFERENCES "talleres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tdis" ADD CONSTRAINT "tdis_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_validacion" ADD CONSTRAINT "solicitudes_validacion_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_tdi" ADD CONSTRAINT "inscripciones_tdi_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_tdi" ADD CONSTRAINT "inscripciones_tdi_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_tdi" ADD CONSTRAINT "inscripciones_tdi_tdi_id_fkey" FOREIGN KEY ("tdi_id") REFERENCES "tdis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "justificantes" ADD CONSTRAINT "justificantes_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "justificantes" ADD CONSTRAINT "justificantes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
