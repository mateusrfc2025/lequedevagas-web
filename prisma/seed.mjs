
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const pessoas = [
  { nome: "Ana", email: "ana@exemplo.com", papel: "empresa", empresaSlug: "aurora-tech" },
  { nome: "Bruno", email: "bruno@exemplo.com", papel: "empresa", empresaSlug: "nuvem-rosa" },
  { nome: "Carla", email: "carla@exemplo.com", papel: "candidata", empresaSlug: null },
];

for (const p of pessoas) {
  const senha = await bcrypt.hash("leque1234", 10);

  await prisma.pessoa.upsert({
    where: { email: p.email },
    update: { senha },
    create: { ...p, senha },
  });
}

console.log("Seed ok: Ana, Bruno e Carla (senha leque1234)");

await prisma.$disconnect();
