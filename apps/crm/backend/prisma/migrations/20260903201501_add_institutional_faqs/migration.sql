-- CreateTable
CREATE TABLE "institutional_faqs" (
    "id" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "subcategoria" TEXT,
    "pregunta" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,
    "audiencia" TEXT[],
    "tags" TEXT[],
    "prioridad" INTEGER NOT NULL DEFAULT 0,
    "fuente" TEXT NOT NULL DEFAULT 'Cerebro/09_FAQ.md',
    "version" TEXT NOT NULL DEFAULT '1.0',
    "validadoEnConversaciones" INTEGER NOT NULL DEFAULT 0,
    "ultimaActualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoPor" TEXT NOT NULL DEFAULT 'sistema',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutional_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "institutional_faqs_categoria_subcategoria_prioridad_idx" ON "institutional_faqs"("categoria", "subcategoria", "prioridad");

-- CreateIndex
CREATE INDEX "institutional_faqs_audiencia_enabled_removed_idx" ON "institutional_faqs"("audiencia", "enabled", "removed");

-- CreateIndex
CREATE INDEX "institutional_faqs_tags_enabled_removed_idx" ON "institutional_faqs"("tags", "enabled", "removed");
