import { buscarEmpresa } from "@/lib/api";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;
    const empresa = await buscarEmpresa(slug);

    if (!empresa) {
        return Response.json({ erro: "Empresa não encontrada" }, { status: 404 });
    }
    return Response.json(empresa);
}