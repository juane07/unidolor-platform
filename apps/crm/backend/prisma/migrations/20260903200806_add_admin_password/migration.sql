-- CreateTable
CREATE TABLE "admin_passwords" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT,
    "resetToken" TEXT,
    "emailToken" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "loggedSessions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "admin_passwords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_passwords_adminId_key" ON "admin_passwords"("adminId");

-- AddForeignKey
ALTER TABLE "admin_passwords" ADD CONSTRAINT "admin_passwords_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
