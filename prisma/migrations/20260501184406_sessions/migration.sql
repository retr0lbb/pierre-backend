-- CreateTable
CREATE TABLE "Sessions" (
    "id" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sessions_token_key" ON "Sessions"("token");

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
