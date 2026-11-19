/*
  Warnings:

  - You are about to drop the column `senhaHash` on the `Pessoa` table. All the data in the column will be lost.
  - Added the required column `senha` to the `Pessoa` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Candidatura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,
    "pessoaId" TEXT,
    "criadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Candidatura_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Candidatura_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Candidatura" ("criadaEm", "email", "id", "nome", "vagaId") SELECT "criadaEm", "email", "id", "nome", "vagaId" FROM "Candidatura";
DROP TABLE "Candidatura";
ALTER TABLE "new_Candidatura" RENAME TO "Candidatura";
CREATE TABLE "new_Pessoa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "papel" TEXT NOT NULL DEFAULT 'candidata',
    "empresaSlug" TEXT
);
INSERT INTO "new_Pessoa" ("email", "empresaSlug", "id", "nome", "papel", "senha") SELECT "email", "empresaSlug", "id", "nome", "papel", "senhaHash" FROM "Pessoa";DROP TABLE "Pessoa";
ALTER TABLE "new_Pessoa" RENAME TO "Pessoa";
CREATE UNIQUE INDEX "Pessoa_email_key" ON "Pessoa"("email");
CREATE TABLE "new_Vaga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "empresaSlug" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "senioridade" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "aceitaIniciante" BOOLEAN NOT NULL DEFAULT false,
    "arquivada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autorId" TEXT,
    CONSTRAINT "Vaga_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Pessoa" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Vaga" ("aceitaIniciante", "area", "autorId", "createdAt", "descricao", "empresa", "empresaSlug", "id", "local", "senioridade", "titulo") SELECT "aceitaIniciante", "area", "autorId", "createdAt", "descricao", "empresa", "empresaSlug", "id", "local", "senioridade", "titulo" FROM "Vaga";
DROP TABLE "Vaga";
ALTER TABLE "new_Vaga" RENAME TO "Vaga";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
