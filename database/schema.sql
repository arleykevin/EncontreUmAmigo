/*
 * ENCONTRE UM AMIGO - ESQUEMA DE BANCO DE DADOS
 * ---------------------------------------------------------
 * Nota Técnica:
 * Este projeto utiliza Back4App (Parse Server) como Backend-as-a-Service.
 * O banco de dados real é NoSQL (MongoDB).
 *
 * Este arquivo SQL serve apenas para DOCUMENTAÇÃO da estrutura de dados,
 * tipagem e relacionamentos utilizados na aplicação.
 */

-- 1. Tabela de Usuários (Padrão do Parse/_User)
-- Gerencia autenticação de administradores e visitantes
CREATE TABLE _User (
    objectId VARCHAR(10) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hash criptografado
    email VARCHAR(255),
    emailVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    ACL JSON -- Controle de Permissões (Public Read/Write)
);

-- 2. Tabela de Animais (Pet)
-- Armazena os dados dos animais disponíveis para adoção
CREATE TABLE Pet (
    objectId VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL, -- 'dog' ou 'cat'
    breed VARCHAR(100), -- Raça
    age VARCHAR(50),
    gender VARCHAR(20), -- 'Macho', 'Fêmea', 'Desconhecido'
    location VARCHAR(150), -- Cidade/UF
    description TEXT, -- Bio gerada por IA ou manual
    image FILE, -- Ponteiro para o arquivo de imagem no Back4App
    
    -- Dados do Doador Responsável
    owner VARCHAR(100), -- Nome do doador
    contact VARCHAR(20), -- WhatsApp
    email VARCHAR(100), -- Email de contato
    
    -- Status de Saúde e Adoção
    vaccinated BOOLEAN DEFAULT FALSE,
    castrated BOOLEAN DEFAULT FALSE,
    isAdopted BOOLEAN DEFAULT FALSE, -- Controle visual de "Adotado"
    
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);

-- 3. Solicitações de Adoção (AdoptionRequest)
-- Registra interesses de usuários em adotar um pet específico
CREATE TABLE AdoptionRequest (
    objectId VARCHAR(10) PRIMARY KEY,
    petName VARCHAR(100), -- Nome do animal
    petId VARCHAR(10), -- Referência ao ID do Pet
    adopterName VARCHAR(100), -- Nome do interessado
    adopterContact VARCHAR(20), -- WhatsApp do interessado
    status VARCHAR(20) DEFAULT 'Analisando', -- 'Analisando', 'Aprovado', 'Reprovado'
    createdAt TIMESTAMP
);

-- 4. Doações de Itens (Donation)
-- Registra intenções de doação de ração, remédios, etc.
CREATE TABLE Donation (
    objectId VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100), -- Nome do doador
    contact VARCHAR(20), -- Contato
    items TEXT, -- Descrição dos itens (ex: "10kg de ração")
    createdAt TIMESTAMP
);

-- 5. Voluntários (Volunteer)
-- Cadastro de pessoas interessadas em ajudar o projeto
CREATE TABLE Volunteer (
    objectId VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100),
    contact VARCHAR(20),
    availability VARCHAR(100), -- Ex: "Finais de semana"
    interests TEXT, -- Ex: "Passeio, Banho, Transporte"
    createdAt TIMESTAMP
);

-- 6. Mensagens de Contato (ContactMessage)
-- Mensagens gerais enviadas pelo formulário "Fale Conosco"
CREATE TABLE ContactMessage (
    objectId VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(150),
    message TEXT,
    createdAt TIMESTAMP
);
