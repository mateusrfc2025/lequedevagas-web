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
