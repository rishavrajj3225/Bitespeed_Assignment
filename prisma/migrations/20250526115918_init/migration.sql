-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "phoneNumber" VARCHAR(255),
    "email" VARCHAR(255),
    "linkedId" INTEGER,
    "linkPrecedence" TEXT NOT NULL DEFAULT 'primary',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
