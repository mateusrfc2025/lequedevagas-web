# Leque de Vagas

Projeto de referência do curso **Introdução ao Next.js** (NickDev). Um mural de
vagas de tecnologia para quem está migrando de carreira.

Este repositório está **congelado no estado da aula 03**. Ele existe para você
comparar com o seu: abrir um arquivo, ver como ficou aqui e entender por que.
Não é para clonar e entregar — o que vale nota é o seu, com os seus dados e as
suas decisões.

## Rodar

```bash
npm install
npm run dev
```

Abre em <http://localhost:3000>. Precisa de Node 20 ou mais novo.

## O que tem aqui, aula por aula

**Aula 01 — fundamentos.** O componente como peça reutilizável, JSX, rota por
pasta e CSS comum. `app/layout.tsx`, `components/Cabecalho.tsx`,
`app/page.tsx`, `app/sobre/page.tsx`, `app/globals.css`.

**Aula 02 — roteamento com App Router.** Rota dinâmica com `[id]` e `params`
que chega como Promise. Os arquivos cujo nome já é a instrução: `layout`
aninhado em `app/vagas/`, `loading`, `error` e `not-found` — e o `not-found` da
raiz, que é outro. Route group `(institucional)`, que dá layout a `/termos` e
`/privacidade` sem entrar na URL. Navegação com `Link`, e `usePathname` no
`MenuLink` para o item ativo.

**Aula 03 — a página que responde.** A fronteira entre servidor e navegador, e
`useState`. As três páginas continuam de servidor; só os pedaços que precisam
de memória levam `"use client"`:

| Arquivo | Que forma de estado ensina |
| --- | --- |
| `components/DescricaoDaVaga.tsx` | booleano, com estado derivado do texto |
| `components/BotaoCopiarLink.tsx` | estado + API que só existe no navegador |
| `components/AbasDaEmpresa.tsx` | estado que é **texto**, não booleano |
| `components/FormularioDeCandidatura.tsx` | campo controlado, lista e conta de "pode enviar" |
| `components/MuralDeVagas.tsx` | estado no pai comum, filtro derivado |
| `components/Filtros.tsx` | **nenhum** — recebe e avisa |

Conte de novo: `app/vagas/page.tsx`, `app/vagas/[id]/page.tsx` e
`app/empresas/[slug]/page.tsx`, e nenhuma delas leva `"use client"`.

## O que NÃO tem, de propósito

Se você achar que está faltando, provavelmente está — mas na aula seguinte.

- **`fetch` e API.** Os dados moram em `data/vagas.ts` e `data/empresas.ts` e
  são importados direto pelas páginas. Na aula 04 eles passam a vir de fora, e
  aí aparece a **espera** — `async`, `revalidate`, `generateStaticParams`.
- **Tailwind.** CSS comum até a aula 08.
- **Autenticação de verdade.** O formulário de candidatura guarda o que você
  digita só na memória da aba. Nada é enviado, nada é salvo. Aula 07.
- **`generateStaticParams`.** É por isso que `/vagas/[id]` e
  `/empresas/[slug]` aparecem como `ƒ` (dinâmico) na tabela do `build`, e não
  como `○`. Também aula 04.

## Detalhes que costumam pegar

**`error.tsx` recebe `retry`, não `reset`.** O nome mudou no Next 16, e o
antigo não existe mais — tutorial que mostra `reset` é de outra versão. Está em
`app/vagas/[id]/error.tsx`.

**`id` é texto.** O que vem da URL é sempre texto, então `id: "1"` e não
`id: 1`. Comparar `"1" === 1` dá falso, e o `find` não acha nada.

**`data/empresas.ts` e `data/vagas.ts` combinam na mão.** Todo `empresaSlug`
tem que existir como `slug`, escrito igual. Quando desencontram, a listagem
mostra a empresa e a página dela dá 404 — e o erro aparece longe de onde foi
criado.

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

## Licença

Material didático do NickDev. Use para estudar, cite quando reaproveitar.
