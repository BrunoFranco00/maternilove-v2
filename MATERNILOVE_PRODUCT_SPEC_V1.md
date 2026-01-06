# MATERNILOVE - Especificação do Produto (V1)

## 1. Visão do Produto
O **MaterniLove** é um ecossistema digital seguro e acolhedora focado em conectar mães, promovendo o apoio mútuo, o compartilhamento de experiências e a economia circular através de um marketplace especializado. O objetivo é reduzir a solidão materna e facilitar o acesso a itens essenciais de maternidade, criando uma rede de confiança.

## 2. Persona Principal
**Nome:** Clara, "A Mãe em Busca de Apoio"
*   **Idade:** 28-35 anos.
*   **Contexto:** Grávida ou mãe de primeira viagem (puerpério).
*   **Dores:** Sente-se isolada, tem dúvidas sobre o desenvolvimento do bebê, precisa economizar em enxoval e quer desapegar de itens que não usa mais.
*   **Objetivos:** Encontrar outras mães na mesma fase, tirar dúvidas sem julgamento e comprar/vender itens infantis com segurança.

## 3. Jornada da Usuária (Cadastro → Dia a Dia)
1.  **Descoberta & Cadastro:**
    *   Clara baixa o app ou acessa o site.
    *   Realiza cadastro simples (Nome, E-mail, Senha e Opcional: Idade do filho/Semanas de gestação).
    *   *Onboarding:* O sistema sugere comunidades baseadas na fase da maternidade dela.
2.  **Primeira Interação (Feed/Comunidade):**
    *   Clara vê o feed com postagens relevantes.
    *   Ela faz uma pergunta sobre amamentação ou sono.
    *   Recebe apoio e respostas de outras mães.
3.  **Uso do Marketplace:**
    *   Clara precisa de um carrinho de bebê. Ela filtra por localização e preço.
    *   Entra em contato com a vendedora via chat/contato direto.
    *   Mais tarde, ela fotografa roupas que não servem mais em seu bebê e cria um anúncio.
4.  **Retenção:**
    *   Notificações de interações em seus posts.
    *   Alertas de novos itens no marketplace que correspondem aos seus interesses.

## 4. Estrutura de Dados (Alto Nível)

### Users (Usuárias)
*   `id`: UUID
*   `name`: String
*   `email`: String (Unique)
*   `password_hash`: String
*   `maternity_stage`: Enum (Gestante, Puérpera, Mãe de Baby, Mãe de Criança)
*   `avatar_url`: String (Opcional)

### Posts (Feed/Comunidade)
*   `id`: UUID
*   `author_id`: FK -> Users
*   `content`: Text
*   `image_url`: String (Opcional)
*   `created_at`: Timestamp
*   `likes_count`: Integer
*   `category`: String (Dúvida, Desabafo, Dica)

### Marketplace_Items (Produtos)
*   `id`: UUID
*   `seller_id`: FK -> Users
*   `title`: String
*   `description`: Text
*   `price`: Decimal
*   `condition`: Enum (Novo, Usado - Bom, Usado - Marcas de uso)
*   `status`: Enum (Disponível, Reservado, Vendido)
*   `images`: Array<String>

### Comments (Interações)
*   `id`: UUID
*   `post_id`: FK -> Posts
*   `author_id`: FK -> Users
*   `content`: Text

## 5. Fluxos Principais

### Fluxo de Autenticação
1.  Tela de Login/Registro.
2.  Validação de credenciais (JWT).
3.  Redirecionamento para Dashboard/Feed.

### Fluxo de Publicação (Feed)
1.  Botão "Criar Post".
2.  Input de texto e upload opcional de foto.
3.  Seleção de categoria (opcional).
4.  Persistência no banco e atualização do Feed.

### Fluxo de Marketplace (Venda)
1.  Botão "Anunciar".
2.  Upload de fotos do produto.
3.  Preenchimento de Título, Descrição e Preço.
4.  Publicação do anúncio na listagem geral.

## 6. Limites da IA (Guardrails)
Se houver integração de IA para suporte ou moderação:
1.  **Isenção Médica:** A IA deve ser explicitamente programada para **nunca** fornecer diagnósticos médicos ou prescrições. Deve sempre recomendar: "Consulte um pediatra ou médico de confiança".
2.  **Sensibilidade Emocional:** Respostas automáticas devem ter tom empático e acolhedor, evitando frieza técnica.
3.  **Privacidade Infantil:** A IA não deve processar ou armazenar dados biométricos de fotos de crianças para identificação.
4.  **Detecção de Risco:** Identificar palavras-chave relacionadas a depressão pós-parto grave e sugerir linhas de ajuda oficiais (CVV, etc).

## 7. Regras de Comunidade
1.  **Respeito e Não-Julgamento:** Tolerância zero para ataques, "mom-shaming" ou discurso de ódio.
2.  **Segurança no Marketplace:**
    *   Proibida a venda de itens vencidos (fórmulas, remédios).
    *   Proibida a venda de itens que firam a segurança do bebê (ex: cadeirinhas danificadas).
3.  **Privacidade:** Não compartilhar dados pessoais sensíveis (endereço, telefone) em comentários públicos.
4.  **Conteúdo Apropriado:** Proibido conteúdo adulto ou violento.

## 8. Preparação para Monetização
Estratégias futuras previstas na arquitetura:
1.  **Freemium:** Acesso gratuito às comunidades, com plano "Premium" para funcionalidades avançadas (ex: filtros exclusivos no marketplace, destaque de perfil).
2.  **Marketplace Ads (Destaques):** Cobrança para destacar anúncios de venda no topo da lista.
3.  **Publicidade Nativa:** Espaços para marcas parceiras (fraldas, roupas, brinquedos) exibirem anúncios relevantes e não intrusivos.
4.  **Clube de Vantagens:** Parcerias com lojas para oferecer cupons exclusivos para assinantes.
