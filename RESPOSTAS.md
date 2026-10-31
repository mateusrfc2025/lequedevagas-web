# Respostas — Lab: Um endereço para quem não é a sua tela

## 1. O que mudou no build depois de adicionar cookies()?

A página passa a ser dinâmica, pois a leitura de cookies depende das informações da requisição de cada usuário. No resultado do build, isso pode ser indicado pelo símbolo `ƒ`, em vez de `○`, que representa uma página pré-renderizada.

## 2. O formulário de criação de vagas deve chamar a API /api/vagas?

Não. O formulário pode usar uma Server Action diretamente. Fazer uma requisição HTTP para a própria API seria desnecessário e adicionaria uma etapa à comunicação.

## 3. Quem pode consumir a API de vagas?

A API pode ser consumida por aplicativos mobile, parceiros que queiram divulgar as vagas, scripts de relatórios e outros sistemas que precisem consultar as oportunidades em formato JSON.