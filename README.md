# 🍵 Tea Heaven (Demo)

Bem-vindo(a) ao **Tea Heaven**! Este é um jogo de gerenciamento aconchegante (estilo *cozy* / Studio Ghibli) onde você prepara chás mágicos e deliciosos para clientes fofos (como o Urso!). 

> **⚠️ Aviso:** Esta é uma **Primeira Versão / Demo**. O jogo ainda está em desenvolvimento, então muitas novidades e polimentos ainda estão por vir!

## 🍂 Sobre o Jogo
A ideia principal é criar um ambiente relaxante. Você atende clientes na bancada, vai até a cozinha, escolhe a xícara certa, mistura a água com dois ingredientes mágicos e ferve tudo no fogão para entregar a bebida perfeita. Tudo isso acompanhado de uma trilha sonora ambiente agradável!

## 📖 Livro de Receitas
O jogo atualmente possui **9 receitas estritas**. Para acertar o pedido, você precisa da combinação exata de Xícara + Água + 2 Ingredientes.

### 💛 Xícara Amarela
- **Chá Abraço de Urso:** Água + Limão + Mel
- **Chá Aurora Boreal:** Água + Camomila + Hortelã
- **Chá Raio de Sol:** Água + Pó Mágico + Cogumelos

### 💜 Xícara Roxa
- **Chá Estelar:** Água + Limão + Pó Mágico
- **Chá Bons Sonhos:** Água + Camomila + Mel
- **Chá da Bruxa Boa:** Água + Hortelã + Cogumelos

### 🤍 Xícara de Vidro
- **Chá Brisa Suave:** Água + Limão + Hortelã
- **Chá Tarde de Outono:** Água + Camomila + Cogumelos
- **Chá do Bosque:** Água + Pó Mágico + Mel

## 🛠️ Tecnologias
O jogo foi construído 100% no lado do cliente (Client-side) usando as tecnologias fundamentais da web, sem frameworks pesados:
- **HTML5** (Estrutura)
- **Vanilla CSS3** (Estilização responsiva, animações e layout)
- **Vanilla JavaScript** (Lógica de drag & drop, gerenciamento de estado e áudio via YouTube IFrame API)

## 🚀 Como jogar localmente
Para rodar o jogo na sua máquina e testar a trilha sonora (que usa a API do YouTube), é necessário rodar um servidor local. 

1. Clone o repositório.
2. Abra o terminal na pasta do jogo.
3. Rode um servidor local. Exemplo com Python:
   ```bash
   python3 -m http.server 8080
   ```
4. Acesse `http://localhost:8080` no seu navegador.
