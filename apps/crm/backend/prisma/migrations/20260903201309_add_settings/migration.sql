-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "settingCategory" TEXT NOT NULL,
    "settingKey" TEXT NOT NULL,
    "settingValue" JSONB,
    "valueType" TEXT NOT NULL DEFAULT 'String',
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isCoreSetting" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settings_settingKey_key" ON "settings"("settingKey");
