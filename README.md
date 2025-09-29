# 🐾 EncontreUmAmigo

## 📝 Descrição do Projeto

O "EncontreUmAmigo" é uma plataforma multiplataforma desenvolvida para otimizar a gestão de abrigos de animais em Fortaleza e facilitar o processo de adoção responsável. Com foco no Objetivo de Desenvolvimento Sustentável (ODS) 11 da ONU – Cidades e Comunidades Sustentáveis, nosso sistema visa conectar animais necessitados a lares amorosos, ao mesmo tempo em que oferece ferramentas essenciais para a administração eficiente dos abrigos.

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

## 👥 Equipe

| Nome Completo | Papel no Projeto | Contato (GitHub/Email) |
| :------------ | :--------------- | :--------------------- |
| [Seu Nome]    | [Seu Papel]      | [Link GitHub ou Email] |
| [Antonia Taynara Maciel Paulo] | [Elaboração de cronograma]   | [taymaciel24@gmail.com] |
| [Arley Kevin Teixeira Rabelo] | [Definição de arquitetuta do sistema]   | [Link GitHub ou Email] |
| [Francisca Josiana dos Santos Oliveira] | [Criação de protótipos de interface web e mobile]   | [noinicio@hotmail.com] |
| [Gabriella Castro de Moura Moreira] | [Definição de requisitos]   | [gabriellacmmoreira@edu.unifor.br] |
| [Paulo Vitor Temoteo Araújo] | [Modelagem de banco de dados]   | [vitutemoteo@hotmail.com] |
| ...           | ...              | ...                    |

---
