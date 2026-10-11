# API REST - Loja Virtual (Trabalho do 3º Bimestre)

**Tecnologias:** Node.js, Express, Sequelize, SQLite
**Alunos:** _(preencher nome dos 2 integrantes)_

## Como rodar
```bash
npm install
npm start        # http://localhost:3000
```
O banco `database.sqlite` e as tabelas são criados automaticamente na primeira execução.

## Entidades e relacionamentos
| Relação | Tipo |
|---|---|
| Usuario → Endereco | 1:N (um usuário tem vários endereços) |
| Usuario → Pedido | 1:N |
| Endereco → Pedido | 1:N (endereço de entrega) |
| Pedido ↔ Produto | N:N, via tabela `ItemPedido` (quantidade, precoUnitario) |

## Rotas
Todas as entidades possuem **LISTAR, BUSCAR, CRIAR, ATUALIZAR e APAGAR**.

| Método | Rota | Ação |
|---|---|---|
| GET | /usuarios | Lista usuários (com endereços) |
| GET | /usuarios/:id | Busca um usuário |
| POST | /usuarios | Cria usuário `{nome, email}` |
| PUT | /usuarios/:id | Atualiza usuário |
| DELETE | /usuarios/:id | Apaga usuário (e seus endereços/pedidos) |
| GET | /usuarios/:id/enderecos | Lista endereços do usuário |
| POST | /usuarios/:id/enderecos | Cria endereço para o usuário |
| GET | /usuarios/:id/pedidos | Lista pedidos do usuário |
| GET/POST | /enderecos | Lista / cria `{rua, numero, cidade, estado, cep, usuarioId}` |
| GET/PUT/DELETE | /enderecos/:id | Busca / atualiza / apaga |
| GET/POST | /produtos | Lista / cria `{nome, preco, estoque}` |
| GET/PUT/DELETE | /produtos/:id | Busca / atualiza / apaga |
| GET | /pedidos | Lista pedidos com usuário, endereço e produtos |
| POST | /pedidos | Cria pedido (desconta estoque, usa transação) |
| PUT | /pedidos/:id | Atualiza `status` e/ou `enderecoId` |
| DELETE | /pedidos/:id | Apaga pedido |

### Exemplo: criar pedido
```json
POST /pedidos
{
  "usuarioId": 1,
  "enderecoId": 1,
  "itens": [
    { "produtoId": 1, "quantidade": 2 },
    { "produtoId": 2, "quantidade": 1 }
  ]
}
```
Status possíveis: `pendente`, `pago`, `enviado`, `entregue`, `cancelado`.

## Estrutura
```
src/
  server.js        # sobe o servidor e sincroniza o banco
  app.js           # Express, rotas e tratamento de erros
  database.js      # conexão Sequelize/SQLite
  models/index.js  # models e associações
  routes/          # crud.js (genérico), usuarios, enderecos, produtos, pedidos
```
