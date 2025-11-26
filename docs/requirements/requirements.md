# Documento de Requisitos – EncontreUmAmigo

Este documento detalha os requisitos funcionais, não-funcionais, regras de negócio, perfis de usuário e histórias de usuário para o projeto "EncontreUmAmigo".

## 1. Perfis de Usuários

* **Gestor do Abrigo:** Responsável por gerenciar todas as operações do abrigo na plataforma, incluindo o cadastro de animais, a análise de candidaturas de adoção, o registro de doações e a gestão de voluntários.
* **Adotante:** Usuário público que acessa a plataforma para encontrar um animal de estimação, visualizar perfis e submeter um formulário de candidatura para adoção.

## 2. Requisitos Funcionais (RF)

### Perfil: Gestor do Abrigo

* **RF01:** O sistema deve permitir ao gestor cadastrar um novo animal, registrando suas informações essenciais (fotos, nome, espécie, raça, sexo, idade, histórico de saúde e status de vacinação).
* **RF02:** O sistema deve permitir ao gestor visualizar e analisar os cadastros e formulários de candidatura preenchidos pelos interessados na adoção.
* **RF03:** O sistema deve permitir que o gestor aprove ou recuse uma candidatura de adoção, registrando o motivo da decisão.
* **RF04:** O sistema deve permitir ao gestor alterar o status de um animal para "Adotado", removendo-o da listagem pública.
* **RF05:** O sistema deve associar o perfil do adotante ao histórico do animal, criando um registro permanente da adoção.
* **RF06:** O sistema deve enviar uma notificação automática (e-mail ou alerta no app) para o candidato aprovado, com as instruções para os próximos passos.
* **RF07:** O sistema deve exibir um painel (dashboard) com a capacidade total do abrigo e o número de vagas disponíveis em tempo real.
* **RF08:** O sistema deve permitir o registro de entrada (doações de itens) e saída (uso diário) de suprimentos como ração e medicamentos.
* **RF09:** O sistema deve permitir ao gestor registrar doações financeiras, com a opção de incluir os dados do doador ou marcá-la como anônima.
* **RF10:** O sistema deve ter uma função para gerar relatórios de doações, filtrando por período, tipo e valor.

### Perfil: Adotante

* **RF11:** O sistema deve permitir ao usuário (adotante) buscar e filtrar a lista de animais por características específicas (ex: espécie, porte, sexo, idade).
* **RF12:** O sistema deve exibir uma galeria de animais disponíveis que corresponda aos filtros de busca aplicados pelo usuário.
* **RF13:** O sistema deve permitir que o usuário clique em um animal da galeria para visualizar seu perfil completo, com mais fotos e descrição detalhada.
* **RF14:** O sistema deve apresentar um botão claro de "Quero Adotar" (ou similar) no perfil de cada animal disponível.
* **RF15:** O sistema deve permitir que o usuário, ao clicar no botão, preencha e envie o formulário de candidatura à adoção.
* **RF16:** O sistema deve ter uma área de "Minhas Adoções" onde o usuário pode acompanhar o status de suas candidaturas em tempo real.
* **RF17:** O sistema deve enviar notificações (via app ou e-mail) ao usuário sempre que o status de sua candidatura for alterado.

## 3. Requisitos Não-Funcionais (RNF)

* **RNF01 (Usabilidade):** O sistema deve ter uma interface intuitiva e de fácil aprendizado, permitindo que um usuário leigo encontre e se candidate para um animal em menos de 5 minutos.
* **RNF02 (Desempenho):** As páginas principais do sistema, como a galeria de animais, devem carregar em menos de 3 segundos em uma conexão de internet 3G.
* **RNF03 (Compatibilidade):** O site deve ser totalmente responsivo, funcionando corretamente nos navegadores mais populares (Chrome, Firefox, Safari) tanto em desktops quanto em dispositivos móveis (smartphones e tablets).
* **RNF04 (Segurança):** Os dados pessoais dos adotantes e gestores devem ser armazenados de forma segura, seguindo as melhores práticas de proteção de dados (por exemplo, senhas devem ser criptografadas).

## 4. Regras de Negócio

* **RN01:** Um adotante deve ter 18 anos ou mais para poder submeter uma candidatura de adoção.
* **RN02:** Um animal com status "Adotado" ou "Em processo de adoção" não pode ser exibido na galeria pública de animais disponíveis.
* **RN03:** Todos os animais devem ser cadastrados com, no mínimo, uma foto.
* **RN04:** Uma candidatura de adoção só pode ser aprovada se o perfil do adotante estiver com todas as informações obrigatórias preenchidas.

## 5. Histórias de Usuário

* **HU01:** **Como um** potencial adotante, **eu quero** filtrar a lista de animais por espécie e porte, **para que** eu possa encontrar rapidamente um pet que se encaixe no meu estilo de vida e na minha casa.
* **HU02:** **Como um** adotante, **eu quero** ver o status da minha candidatura em uma área pessoal, **para que** eu possa acompanhar o progresso do meu processo de adoção.
* **HU03:** **Como um** gestor de abrigo, **eu quero** registrar a entrada de um novo animal com todas as suas informações de saúde e perfil, **para que** os potenciais adotantes tenham dados claros e completos para a tomada de decisão.
