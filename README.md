# Leque de Vagas

## Projeto de Next.js para um Leque de Vagas de Emprego
 Grupo: 
 Frente 1 - Fernando Da Silva Neto
 Frente 2 - Mateus Ramalho Crispim
 Frente 3 - João Victor Marinho
 Frente 4 - Jasmin Cleide M da Macena 

## Rodar

```bash
npm install
npm run dev
```

Abre em <http://localhost:3000>. Precisa de Node 20 ou mais novo.

| Arquivo | Que forma de estado ensina |
| --- | --- |
| `components/DescricaoDaVaga.tsx` | booleano, com estado derivado do texto |
| `components/BotaoCopiarLink.tsx` | estado + API que só existe no navegador |
| `components/AbasDaEmpresa.tsx` | estado que é **texto**, não booleano |
| `components/FormularioDeCandidatura.tsx` | campo controlado, lista e conta de "pode enviar" |
| `components/MuralDeVagas.tsx` | estado no pai comum, filtro derivado |
| `components/Filtros.tsx` | **nenhum** — recebe e avisa |

## Estrutura

```
app/
├── layout.tsx                     moldura do site + cabeçalho
├── page.tsx                       /
├── not-found.tsx                  404 do site inteiro
├── globals.css
├── sobre/page.tsx                 /sobre
├── (institucional)/               route group — não entra na URL
│   ├── layout.tsx
│   ├── termos/page.tsx            /termos
│   └── privacidade/page.tsx       /privacidade
├── vagas/
│   ├── layout.tsx                 moldura da área de vagas
│   ├── loading.tsx                esqueleto de espera
│   ├── page.tsx                   /vagas
│   └── [id]/
│       ├── page.tsx               /vagas/1
│       ├── error.tsx
│       └── not-found.tsx
└── empresas/[slug]/page.tsx       /empresas/aurora-tech
components/                        as peças; só as com memória são de cliente
data/                              o dado, enquanto ele mora dentro do projeto
```

## Rotas

| Arquivo | URL |
| --- | --- |
| app/page.tsx | / |
| app/sobre/page.tsx | /sobre |
| app/(institucional)/termos/page.tsx | /termos |
| app/(institucional)/privacidade/page.tsx | /privacidade |
| app/vagas/page.tsx | /vagas |
| app/vagas/nova/page.tsx | /vagas/nova |
| app/vagas/[id]/page.tsx | /vagas/1 |
| app/empresas/page.tsx | /empresas |
| app/empresas/[slug]/page.tsx | /empresas/aurora-tech |
| app/empresas/[slug]/editar/page.tsx | /empresas/aurora-tech/editar |

Saída do `npm run build`: [
Route (app)                  Revalidate  Expire
┌ ○ /                                1m      1y
├ ○ /_not-found
├ ○ /empresas                        1m      1y
├   /empresas/[slug]
│ ├ ● /empresas/aurora-tech          1m      1y
│ ├ ● /empresas/nuvem-rosa           1m      1y
│ ├ ● /empresas/mare-viva            1m      1y
│ └ ● [+2 more paths]
├ ○ /privacidade
├ ○ /sobre
├ ○ /termos
├ ○ /vagas                           1m      1y
├   /vagas/[id]
│ ├ ● /vagas/1                       1m      1y
│ ├ ● /vagas/2                       1m      1y
│ ├ ● /vagas/3                       1m      1y
│ └ ● [+9 more paths]
└ ○ /vagas/nova                      1m      1y


○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses generateStaticParams)]

A pasta `[id]` é um segmento dinâmico: os colchetes dizem ao Next que aquele
pedaço da URL muda. Em vez de criar uma pasta para cada vaga, existe um único
arquivo, `app/vagas/[id]/page.tsx`, que atende `/vagas/1`, `/vagas/2` e
qualquer outro número. O valor da URL chega em `params.id`, e a página usa esse
id para buscar a vaga certa. O `generateStaticParams` lista os ids existentes
para o Next gerar uma página de cada vaga já no build, e quando o id não existe
a página chama `notFound()`.

Decisão: "Vagas" NÃO fica aceso em `/vagas/1`. O `MenuLink` compara o endereço
atual com o `href` de forma exata (`caminho === href`), então só acende na
página do próprio link. Escolhi assim porque, se comparasse pelo começo do
endereço (`startsWith`), o "Início" (`/`) ficaria aceso em todas as páginas, e
em `/vagas/nova` ficariam acesos "Vagas" e "Publicar vaga" ao mesmo tempo. O
preço da decisão é que, dentro de uma vaga, nenhum item do menu indica onde a
pessoa está.

## O estado do projeto

| frente | quem | componente de cliente |
| --- | --- | --- |
| 1 · Vaga | Fernando | `DescricaoDaVaga`, `BotaoCopiarLink` |
| 2 · Empresa | Mateus | `AbasDaEmpresa` |
| 3 · Pessoa e candidatura | João Victor | `FormularioDeCandidatura` |
| 4 · Busca e números | Jasmin | `MuralDeVagas` |

- `DescricaoDaVaga`: tem `onClick` e lembra se o texto está aberto.
- `BotaoCopiarLink`: tem `onClick` e usa `navigator.clipboard`, que só existe no navegador.
- `AbasDaEmpresa`: tem `onClick` e guarda qual aba foi escolhida.
- `FormularioDeCandidatura`: guarda a lista de habilidades (chips) na tela.
- `MuralDeVagas`: guarda a busca e a área escolhida.

Não guardamos em estado: a lista filtrada (`visiveis`), a lista de áreas e o
número de vagas que aceitam iniciante. Tudo isso é calculado a cada renderização
a partir de `vagas`, `busca` e `area`. Se guardássemos uma cópia em `useState`,
ela poderia ficar desatualizada em relação à busca, e teríamos que lembrar de
atualizar os dois lugares.

## De onde vêm os dados

As vagas e empresas vêm de `dados/vagas.json` e `dados/empresas.json`,
publicados no GitHub e buscados só em `lib/api.ts`, com `revalidate: 60`.
No pior caso, uma vaga nova no JSON leva cerca de 60 segundos para aparecer.

## Onde os dados escritos vivem (aula 05)

Vagas criadas, vagas arquivadas, candidaturas e edições de empresa vivem na
**memória do servidor** (em `lib/api.ts`). Quando o servidor reinicia, tudo
isso some, e no site publicado cada instância tem a sua memória. Isso é
esperado: a aula 06 troca essa memória por um banco de dados.

## Licença

Material didático do NickDev. Use para estudar, cite quando reaproveitar.
