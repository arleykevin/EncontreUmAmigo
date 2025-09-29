# Documento de Arquitetura – EncontreUmAmigo

Este documento descreve a arquitetura do sistema "EncontreUmAmigo", incluindo sua definição, padrões arquiteturais, tecnologias escolhidas e justificativas para as decisões tomadas.

## 1. Definição da Arquitetura do Sistema

O projeto "EncontreUmAmigo" adota uma **Arquitetura em Três Camadas (3-Tier Architecture)**, um modelo consolidado que promove a separação de responsabilidades, facilitando o desenvolvimento, manutenção e escalabilidade do sistema. As camadas são interconectadas, mas operam de forma independente para otimizar o fluxo de dados e a lógica de negócio.

### Camadas da Arquitetura:

1.  **Camada de Apresentação (Frontend):**
    * **Função:** É a interface do usuário, responsável por tudo que o adotante e o gestor veem e interagem. Inclui o layout, os elementos visuais (botões, formulários, galeria de animais) e a lógica de interação diretamente no navegador ou dispositivo móvel.
    * **No "EncontreUmAmigo":** Irá exibir os perfis dos animais, os filtros de busca, os formulários de candidatura e o painel de gestão para os abrigos.

2.  **Camada de Aplicação (Backend):**
    * **Função:** Atua como o "cérebro" do sistema. É onde toda a lógica de negócio é processada, as regras (como aprovação de adoções) são aplicadas, e a comunicação com o banco de dados é gerenciada. Esta camada expõe uma API para que a camada de apresentação possa solicitar e enviar dados.
    * **No "EncontreUmAmigo":** Responsável por gerenciar o cadastro de animais, a autenticação de usuários, o processamento de candidaturas, o controle de estoque e o registro de doações.

3.  **Camada de Dados (Database):**
    * **Função:** É o repositório central e seguro onde todas as informações do sistema são armazenadas e gerenciadas. Garante a integridade e a persistência dos dados.
    * **No "EncontreUmAmigo":** Armazenará detalhes sobre os animais, perfis de adotantes, registros de adoções, dados de doações e informações de voluntários.

## 2. Diagrama de Arquitetura

O diagrama abaixo ilustra a comunicação e o fluxo de dados entre as três camadas principais do sistema "EncontreUmAmigo".

```mermaid
graph TD
    A [Frontend: Aplicação Web/Mobile] --> |Requisições (HTTP/HTTPS)| B(Backend: Lógica de Negócio e APIs)
    B -->|Consultas/Transações| C[Banco de Dados: Persistência de Dados]
    C -->|Resultados| B
    B -->|Respostas (JSON)| A
```
