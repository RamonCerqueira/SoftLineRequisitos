# Sistema de Levantamento de Requisitos - Soft Line Sistemas

Sistema inteligente para levantamento de requisitos de software com geração automática de documentação, estimativas e diagramas técnicos.

## 🚀 Funcionalidades

### ✨ Interface Moderna
- **Splash Screen Dinâmica**: Carregamento de 9 segundos com frases sobre desenvolvimento
- **Design Elegante**: Visual profissional com as cores da empresa (verde, azul, cinza)
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Animações Suaves**: Micro-interações e transições elegantes

### 📋 Formulário Inteligente
- **Validação Automática**: Campos obrigatórios e validação em tempo real
- **Requisitos Dinâmicos**: Adicione/remova requisitos funcionais e não funcionais
- **Interface Intuitiva**: Seções organizadas e fáceis de preencher

### 🤖 Análise Automática
- **Estimativa de Complexidade**: Análise baseada em palavras-chave
- **Recomendações de Tecnologia**: Stack sugerida por tipo de projeto
- **Estimativa de Custos**: Cálculo automático de horas e valores
- **Cronograma Detalhado**: Prazo por fases de desenvolvimento
- **Análise de Riscos**: Identificação automática de possíveis problemas

### 📄 Geração de Documentação
- **PDF Profissional**: Documentação completa formatada
- **Diagramas de Classes**: Geração automática em PlantUML
- **Diagramas de Arquitetura**: Visualização da estrutura técnica
- **Dashboard Interativo**: Visualização completa dos dados do projeto

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide Icons
- **Backend**: Next.js API Routes
- **Banco de Dados**: SQL Server com Prisma ORM
- **Validação**: Zod
- **Geração de PDF**: jsPDF
- **Deploy**: Vercel

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- SQL Server (local ou na nuvem)
- npm ou yarn

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd soft-line-nextjs
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas configurações
DATABASE_URL="sqlserver://localhost:1433;database=soft_line_db;user=sa;password=sua_senha;encrypt=true;trustServerCertificate=true"
```

4. **Execute as migrações do banco**
```bash
npx prisma generate
npx prisma db push
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse o sistema**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🚀 Deploy no Vercel

### Configuração Automática

1. **Conecte ao Vercel**
```bash
npm i -g vercel
vercel login
vercel
```

2. **Configure as variáveis de ambiente no Vercel**
- `DATABASE_URL`: String de conexão do SQL Server
- `NEXTAUTH_SECRET`: Chave secreta para autenticação

### Configuração Manual

1. Faça push do código para GitHub
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático será executado

## 📖 Como Usar

### 1. Acesso ao Sistema
- Aguarde a splash screen de carregamento (9 segundos)
- Clique em "Iniciar Levantamento de Requisitos"

### 2. Preenchimento do Formulário
- **Informações da Empresa**: Dados básicos do cliente
- **Informações do Projeto**: Descrição da ideia e objetivos
- **Requisitos Funcionais**: Funcionalidades obrigatórias
- **Requisitos Não Funcionais**: Características de qualidade (opcional)

### 3. Análise e Documentação
Após o envio, o sistema gera automaticamente:
- Análise de complexidade do projeto
- Estimativas de tempo e custo
- Recomendações de tecnologias
- Identificação de riscos
- Cronograma detalhado

### 4. Downloads Disponíveis
- **Documentação PDF**: Relatório completo do projeto
- **Diagrama de Classes**: Estrutura técnica em PlantUML
- **Diagrama de Arquitetura**: Visão geral da solução

---

**Soft Line Sistemas** - Transformando ideias em soluções tecnológicas inovadoras.
