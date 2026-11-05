import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const pessoas = [
  { nome: "Ana", email: "ana@exemplo.com", papel: "empresa", empresaSlug: "aurora-tech" },
  { nome: "Bruno", email: "bruno@exemplo.com", papel: "empresa", empresaSlug: "nuvem-rosa" },
  { nome: "Carla", email: "carla@exemplo.com", papel: "candidata", empresaSlug: null },
];

for (const p of pessoas) {
  // um hash por pessoa: a mesma senha gera hashes diferentes (o sal do bcrypt)
  const senhaHash = await bcrypt.hash("leque1234", 10);
  await prisma.pessoa.upsert({
    where: { email: p.email },
    update: {},
    create: { ...p, senhaHash },
  });
}

console.log("Seed ok: ana, bruno e carla (senha leque1234)");
await prisma.$disconnect();