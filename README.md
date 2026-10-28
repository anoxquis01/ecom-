# REHVA

Loja virtual responsiva da REHVA, com identidade visual pink/editorial, experiência de entrada animada e catálogo de produtos administrável. O projeto combina uma vitrine própria com links de checkout hospedados na Yampi.

## Experiência da loja

- A entrada começa com um convite para o REHVA Club e uma prévia estática.
- Ao clicar em **Entrar**, é reproduzido um GIF de abertura específico para desktop ou mobile. Com a preferência do navegador por movimento reduzido, a animação é pulada.
- A vitrine apresenta conteúdo institucional, filtros de categorias e cards de produtos.
- Cada produto pode ter página de detalhes com galeria de imagens, variações, tamanhos brasileiros e tabela de medidas.
- Os preços podem incluir valor promocional, preço original riscado e percentual de desconto.
- A sacola permite adicionar itens, alterar quantidades e remover produtos. Seu estado é mantido durante a sessão do navegador.
- Os botões de compra abrem o link de checkout Yampi cadastrado para o produto. A barra de compra fixa na parte inferior da tela de detalhes é exibida em mobile.
- Um cupom configurável pode ser copiado pela interface da loja.

**Limitação atual da sacola:** o checkout direto pela sacola é oferecido apenas quando há um único item com quantidade 1 e checkout configurado. Para outras combinações, a interface informa que a finalização do carrinho ainda não está configurada. Os botões de compra individuais continuam usando o checkout Yampi do produto.

## Painel administrativo

O painel está em `/admin.html` durante o desenvolvimento e permite:

- Criar, editar e remover produtos.
- Configurar preço normal, preço promocional, descrição e categoria.
- Adicionar variações e múltiplas imagens por variação, incluindo upload de imagens.
- Ativar tamanhos e editar a tabela de medidas de cada produto.
- Cadastrar o link de checkout Yampi. Se for colado o HTML de um botão Yampi, o painel extrai e armazena somente o endereço de checkout.
- Guardar um link HTTP/HTTPS do fornecedor como referência administrativa. Esse campo não é exibido na vitrine nem usado como checkout.
- Criar, renomear e remover categorias.
- Editar textos, imagem de capa e configurações do cupom da loja.

O painel **não possui autenticação** e foi limitado ao desenvolvimento local. O servidor de produção não publica a interface administrativa e bloqueia operações de gravação. Não exponha o modo de desenvolvimento à internet.

## Tecnologias e estrutura

- Node.js e módulos JavaScript ES.
- Vite para servir o projeto em desenvolvimento e gerar o bundle de produção.
- HTML e CSS responsivos; a interface da loja e do painel é implementada principalmente em JavaScript nativo.
- React e `@paper-design/shaders-react` são usados para o efeito visual de fundo.
- Firebase Realtime Database para o catálogo; a API HTTP local continua responsável pelos uploads durante o desenvolvimento.

Arquivos principais:

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura da entrada e da vitrine. |
| `entry.js`, `entry.css` | Comportamento e apresentação da introdução, cupom e fundo visual. |
| `app.js` | Transição da animação de entrada para a loja e inicialização do catálogo. |
| `product-cards.js` | Catálogo, detalhes de produto, sacola, preços e links de compra. |
| `styles.css` | Estilos responsivos da vitrine e dos produtos. |
| `admin.html`, `admin.js`, `admin.css` | Interface e comportamento do painel administrativo. |
| `firebase.js` | Configuração e acesso ao catálogo no Firebase Realtime Database. |
| `server.mjs`, `admin-store.mjs` | Servidor local, API e upload de imagens durante o desenvolvimento. |
| `catalog.seed.json` | Catálogo inicial e fonte de dados de leitura no modo de produção. |
| `loja/`, `photo/` | Imagens estáticas da marca e dos produtos. |
| `oficialdesktop.gif`, `oficialmobile.gif` | Animações de abertura para desktop e mobile. |

## Dados e persistência

O catálogo da vitrine e do painel é carregado e salvo no caminho `catalog` do Firebase Realtime Database. Para publicar o catálogo inicial, execute `npm run seed:firebase`. Novos uploads continuam em `data/uploads/` e os caminhos locais são mantidos nos produtos.

`data/` e `dist/` estão listados no `.gitignore`. Portanto, `data/catalog.json` é estado local e não deve ser confundido com o catálogo versionado em `catalog.seed.json`. Preserve o catálogo local ao limpar ou recriar dados.

O modo de produção serve o conteúdo compilado em `dist/` e lê o catálogo diretamente do Firebase. As regras do Realtime Database devem permitir leitura pública apenas no caminho necessário e exigir autenticação para gravações administrativas; o painel continua não tendo login.

## Como executar

Requer uma versão recente do Node.js e npm.

```powershell
npm install
npm run dev
```

Na primeira configuração, publique o catálogo inicial:

```powershell
npm run seed:firebase
```

Antes disso, publique `database.rules.json` nas regras do Realtime Database e
configure uma credencial autenticada para a gravação administrativa. A regra
de leitura pública permite que a vitrine funcione; a regra de escrita exige
autenticação para não deixar o catálogo aberto a alterações por terceiros.
O painel ainda precisa receber autenticação Firebase antes de ser exposto fora
do ambiente local.

Abra o endereço informado pelo servidor — por padrão, `http://localhost:4173`. A porta pode ser definida pela variável de ambiente `PORT`. A administração local fica em `http://localhost:4173/admin.html`.

Para gerar e servir a versão de produção:

```powershell
npm run build
npm start
```

O servidor de produção também usa a porta `4173` por padrão. Configure `PORT` se essa porta já estiver ocupada.

## Privacidade e integrações

- Os checkouts são externos e dependem dos links cadastrados na Yampi.
- O link do fornecedor existe para controle administrativo e não faz parte da experiência pública.
- A interface atual oferece convite para o grupo do WhatsApp; não há, neste fluxo descrito, formulário ou persistência própria de leads de nome e telefone.
- A sacola utiliza armazenamento de sessão do navegador e não substitui um sistema de pedidos ou pagamento.
