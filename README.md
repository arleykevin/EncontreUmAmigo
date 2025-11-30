# 🐾 EncontreUmAmigo

## 📝 Descrição do Projeto

O "EncontreUmAmigo" é uma plataforma multiplataforma desenvolvida para otimizar a gestão de abrigos de animais em Fortaleza e facilitar o processo de adoção responsável. Com foco no Objetivo de Desenvolvimento Sustentável (ODS) 11 da ONU – Cidades e Comunidades Sustentáveis, nosso sistema visa conectar animais necessitados a lares amorosos, ao mesmo tempo em que oferece ferramentas essenciais para a administração eficiente dos abrigos.

# Link para acesso: https://encontre-um-amigo.vercel.app/ 
# Faça o downlaod do App Android: 


##  problematização Abordado e Justificativa

A cidade de Fortaleza enfrenta um grande desafio com o alto número de animais abandonados, resultando em abrigos superlotados e com recursos limitados. Muitas dessas organizações, especialmente as mais carentes, dependem exclusivamente de doações e gerenciam seus processos complexos (adoções, doações, voluntários, estoque) de forma manual, com planilhas ou cadernos. Essa falta de um planejamento específico e de acesso à tecnologia dificulta a gestão e diminui o alcance de potenciais adotantes.

O projeto "EncontreUmAmigo" surge como uma solução para essa lacuna, oferecendo uma plataforma tecnológica gratuita e acessível. Para os abrigos, a ferramenta visa otimizar a gestão, automatizar processos e aumentar a visibilidade dos animais. Para a comunidade, a plataforma busca ser um ponto central de confiança e credibilidade, tornando o processo de encontrar e adotar um novo amigo mais seguro, simples e didático.

## 🎯 Objetivos do Sistema

* **Otimizar** a gestão interna de abrigos de animais em Fortaleza, fornecendo uma ferramenta gratuita para o controle de adoções, estoque de suprimentos e voluntários.
* **Facilitar** o processo de adoção para a comunidade, centralizando as informações dos animais disponíveis em uma plataforma segura, transparente e de fácil navegação.
* **Aumentar** a visibilidade dos abrigos e fortalecer a conexão com a comunidade, incentivando o engajamento através de doações e trabalho voluntário.

## 🗺️ Escopo do Projeto

### **Funcionalidades DENTRO do escopo desta versão:**
* Gerenciamento completo do ciclo de adoção (cadastro de animais, candidatura de adotantes, aprovação/recusa).
* Cadastro e visualização de perfis de animais e adotantes.
* Controle de capacidade do abrigo e gestão de estoque de suprimentos.
* Divulgação de informações para doação (Chave PIX, conta bancária).
* Registro manual de doações financeiras e de itens.
* Cadastro de voluntários e suas informações de contato.
* Funcionalidades de busca e filtro para animais.
* Notificações sobre o status da adoção para adotantes.

### **Funcionalidades FORA do escopo desta versão (para futuras versões):**
* Gateway de pagamento para processamento de doações financeiras dentro da plataforma.
* Sistema de agendamento de turnos e tarefas para voluntários (o contato será feito externamente nesta versão).
* Chat ou sistema de mensagens em tempo real entre adotantes e o abrigo.
* Módulos de relatórios financeiros avançados ou integração contábil.

## 🏗️ Visão Geral da Arquitetura

O projeto "EncontreUmAmigo" seguirá uma **Arquitetura em Três Camadas (3-Tier)**, um padrão robusto que separa as responsabilidades do sistema. Esta abordagem garante modularidade, escalabilidade e facilidade de manutenção. As camadas são:

1.  **Apresentação (Frontend):** A interface com o usuário, responsável pela interação e exibição dos dados. Será desenvolvida como uma Single-Page Application (SPA) para a web e terá uma versão adaptada para dispositivos móveis, garantindo uma experiência responsiva e intuitiva.
2.  **Aplicação (Backend):** O servidor central, responsável por toda a lógica de negócio, processamento de dados e pela exposição de uma API RESTful para comunicação com o frontend. Ele atua como intermediário entre a camada de apresentação e a camada de dados.
3.  **Dados (Database):** O sistema de banco de dados, responsável pela persistência e gerenciamento seguro de todas as informações do sistema (perfis de animais, adotantes, doações, etc.).

## 🛠️ Tecnologias Propostas

Para a implementação do projeto, propõe-se o uso do seguinte conjunto de tecnologias, que formam a popular **MERN Stack**, conhecida por sua eficiência e flexibilidade:

* **Frontend:** [React.js](https://react.dev/) - Biblioteca JavaScript para construção de interfaces de usuário dinâmicas e reativas.
* **Backend:** [Node.js](https://nodejs.org/en) com [Express.js](https://expressjs.com/) - Ambiente de tempo de execução JavaScript e framework web minimalista para construção de APIs eficientes.
* **Banco de Dados:** [MongoDB](https://www.mongodb.com/) - Banco de dados NoSQL baseado em documentos, ideal para escalabilidade e agilidade no desenvolvimento.

## 🗓️ Cronograma de Desenvolvimento – Etapa 2 (N708)

O desenvolvimento da Etapa 2 (N708) será dividido em Sprints quinzenais, totalizando 6 Sprints ao longo do período da disciplina, com um foco contínuo na integração e testes.

* **Semanas 1-2: Sprint 1 - Configuração e Fundação do Backend**
    * Montagem do ambiente de desenvolvimento.
    * Criação da estrutura inicial do servidor com Express.js e modelagem do banco de dados.
    * Desenvolvimento da API de autenticação (cadastro e login de usuários).
* **Semanas 3-4: Sprint 2 - Gestão de Animais e Abrigos**
    * Desenvolvimento da API (CRUD) para os animais.
    * Implementação da API para gestão de informações do abrigo e controle de estoque.
    * Criação das primeiras telas do painel administrativo do gestor (frontend).
* **Semanas 5-6: Sprint 3 - Jornada Pública do Adotante**
    * Desenvolvimento da galeria de animais, funcionalidades de busca e filtro no frontend.
    * Criação da página de perfil detalhado de cada animal.
    * Integração dessas telas com as APIs correspondentes.
* **Semanas 7-8: Sprint 4 - Fluxo de Adoção e Doações**
    * Implementação do formulário de candidatura à adoção e da área "Minhas Adoções" para o usuário.
    * Desenvolvimento da funcionalidade de aprovação/recusa de candidaturas no painel do gestor.
    * Implementação da funcionalidade de registro manual de doações.
* **Semanas 9-10: Sprint 5 - Testes, Validação e Refinamento**
    * Execução de testes funcionais e de usabilidade em todas as funcionalidades.
    * Correção de bugs e refatoração do código para otimização.
    * Ajustes de UI/UX com base em feedbacks.
* **Semanas 11-12: Sprint 6 - Finalização e Entrega**
    * Revisão final de toda a aplicação e documentação.
    * Preparação da apresentação final do projeto.
    * (Opcional) Considerar o deploy da aplicação em um serviço gratuito.

---


# EncontreUmAmigo 🐾 Etapa 2 (N708)

## 1. Título e Descrição do Projeto
**Nome do Sistema:** EncontreUmAmigo

**Descrição:**
O **EncontreUmAmigo** é uma plataforma *Fullstack* (Web e Mobile) desenvolvida para facilitar a adoção de animais de estimação. O sistema atua como uma ponte tecnológica entre protetores/ONGs que possuem animais para doação e pessoas interessadas em adotar um novo companheiro.

**Problema Solucionado:**
Muitos animais abandonados não encontram lares devido à falta de visibilidade e à descentralização das informações. Protetores independentes muitas vezes dependem de redes sociais dispersas. O sistema centraliza esses dados, oferece ferramentas de gestão para os doadores e utiliza Inteligência Artificial para auxiliar na compatibilidade entre pet e adotante.

---

## 2. Funcionalidades Implementadas

### Status de Implementação: ✅ Completo (MVP)

* **Vitrine de Adoção:** Listagem de animais com filtros por espécie (Cão/Gato) e busca por nome/localização.
* **Detalhes do Pet:** Modal com fotos, descrição completa, status de saúde (vacinado/castrado) e contato direto (WhatsApp/Email).
* **Conselheiro Virtual (IA):** Chatbot integrado com Google Gemini para tirar dúvidas e recomendar pets baseados no perfil do usuário.
* **Painel Administrativo (Área Restrita):**
    * Login seguro com autenticação.
    * Cadastro e Edição de Pets com upload de fotos.
    * Gestão de status (Disponível/Adotado).
    * Visualização de Solicitações de Adoção (CRM simples com status: Analisando/Aprovado).
    * Gestão de Doações de itens e Voluntários.
* **Solicitação de Adoção:** Formulário para interessados enviarem seus dados ao protetor.
* **Área de Doações:** Informações para PIX e Pontos de Coleta, além de formulário de intenção de doação de itens.
* **App Mobile:** Versão Android nativa gerada via Capacitor.

### Screenshots
*(Adicione aqui as imagens da pasta `validation/evidence`)*
* ![Tela Inicial Mobile](validation/evidence/Mobile_Home.png)
* ![Painel Administrativo](validation/evidence/Admin_Panel.png)
* ![Chat com IA](validation/evidence/AI_Chat.png)

---

## 3. Tecnologias Utilizadas

* **Frontend:** React.js, Vite.
* **Estilização:** Tailwind CSS (Design responsivo e moderno).
* **Backend (BaaS):** Back4App (Baseado em Parse Server) para banco de dados e autenticação.
* **Mobile:** Capacitor (Conversão de Web para Android Nativo).
* **Inteligência Artificial:** Google Gemini API (Modelo gemini-pro/gemini-1.5-flash).
* **Controle de Versão:** Git & GitHub.
* **Ícones:** Lucide React (via componente personalizado SVG).

---

## 4. Arquitetura do Sistema

O sistema utiliza uma arquitetura **Cliente-Servidor (Serverless)**:

1.  **Frontend (Cliente):** Aplicação SPA (Single Page Application) em React que consome as APIs. Responsável por toda a interface e lógica de apresentação.
2.  **Backend (Serviço):** O Back4App atua como backend, gerenciando o banco de dados NoSQL (Classes: `Pet`, `Donation`, `AdoptionRequest`, `User`, `Volunteer`, `ContactMessage`) e a autenticação de usuários.
3.  **Integração:** A comunicação é feita através do **Parse SDK** para JavaScript.
4.  **Módulo IA:** Serviço isolado que conecta diretamente à API do Google Gemini para processamento de linguagem natural.

---

## 5. Instruções de Instalação e Execução

### Pré-requisitos
* Node.js (v16 ou superior)
* Conta no Back4App (para chaves de API)
* Chave de API do Google AI Studio
* Android Studio (apenas para build mobile)

### Passo a Passo

1.  **Clonar o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/EncontreUmAmigo-React.git](https://github.com/seu-usuario/EncontreUmAmigo-React.git)
    cd EncontreUmAmigo-React
    ```

2.  **Instalar dependências:**
    ```bash
    npm install
    ```

3.  **Configurar Chaves:**
    * Abra `src/services/back4app.js` e insira suas `Application ID` e `Javascript Key`.
    * Abra `src/services/gemini.js` e insira sua `API Key` do Google.

4.  **Executar em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O sistema estará acessível em `http://localhost:5173`.

5.  **Gerar versão Mobile (Android):**
    ```bash
    npm run build
    npx cap sync
    npx cap open android
    ```

---

## 6. Acesso ao Sistema

* **URL de Acesso (Web):** https://encontre-um-amigo.vercel.app/
* **Credenciais de Teste (Admin):**
    * **Usuário:** `admin`
    * **Senha:** `1234`

---

## 7. Validação com Público-Alvo

### Definição do Público-Alvo
* **Adotantes:** Pessoas de 18-60 anos buscando animais de estimação, familiarizadas com uso de smartphones.
* **Protetores:** Gestores de abrigos ou voluntários que necessitam de uma ferramenta para organizar as adoções.

### Resumo da Validação
O sistema foi validado através de testes de usabilidade em dispositivos móveis e desktop.

### Feedbacks e Ajustes
* **Feedback:** "O formulário de cadastro estava quebrado no modo escuro do celular."
    * **Ajuste:** Refatoração do CSS para forçar fundo branco e ajuste de paddings no mobile.
* **Feedback:** "Falta de feedback visual se o animal já foi adotado."
    * **Ajuste:** Implementação de etiqueta visual "ADOTADO" e filtro de ordenação.
* **Feedback:** "Dificuldade em saber se a doação foi recebida."
    * **Ajuste:** Criação da aba "Doações" no painel administrativo para baixa e controle.

---

## 8. Equipe de Desenvolvimento

| Nome Completo | Papel no Projeto | Contato (GitHub/Email) |
| :------------ | :--------------- | :--------------------- |
| [Antonia Taynara Maciel Paulo] | [Elaboração de cronograma]   | [taymaciel24@gmail.com] |
| [Arley Kevin Teixeira Rabelo] | [Definição de arquitetuta do sistema]   | [arleykevintr@gmail.com] |
| [Francisca Josiana dos Santos Oliveira] | [Criação de protótipos de interface web e mobile]   | [noinicio@hotmail.com] |
| [Gabriella Castro de Moura Moreira] | [Definição de requisitos]   | [gabriellacmmoreira@edu.unifor.br] |
| [Paulo Vitor Temoteo Araújo] | [Modelagem de banco de dados]   | [vitutemoteo@hotmail.com] |


