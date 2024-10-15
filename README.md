# Trabalho de banco de dados - gestão de TCCS's da fatec

Este é um projeto desenvolvido utilizando **Next.js 14**, **Prisma** como ORM e **MySQL** como banco de dados. O objetivo é gerenciar documentos acadêmicos, como monografias, pôsteres e artigos, oferecendo recursos para acompanhar o progresso dos alunos e relatórios para orientadores.

Documentações

https://ui.shadcn.com/docs

https://nextjs.org/docs

https://tailwindcss.com/docs

## Instalação

Siga os passos abaixo para configurar o projeto localmente:

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie uma instância do mysql

- Abra o XAMPP, incie o mySQL, o Apache e crie um banco chamado fatec_tcc_v1
- Popule o banco usando os script de criação das tabelas e as cargas fornecidas no documento do grupo
- Alimenta o ORM com as informações do banco seguindo os passos abaixo

```bash
npx prisma db pull
npx prisma generate
```

### 4. Rodando o projeto localmente

- Execute os comandos em abas separadas do console de sua IDE (vscode)
- O XAMPP deve estar aberto e executando o banco de dados

```bash
npx prisma studio
```

```bash
npm run dev
```

### 5. Observações

Como nem tudo são flores, o prisma não ainda não lida perfeitamente com views, consequentemente, para fazer as views temos que adicionar um identificador único manualmente, por exemplo:

```tsx
view vw_tcc_detalhado {
  tcc_id                Int       @unique @default(0)
  titulo_tcc            String    @db.VarChar(255)
  nome_aluno            String    @db.VarChar(100)
  data_ingresso_aluno   DateTime  @db.Date
  nome_orientador       String    @db.VarChar(100)
  nome_turma            String    @db.VarChar(100)
  tema                  String    @db.VarChar(255)
  classificacao         String    @db.VarChar(255)
  nota_final            String?   @db.VarChar(7)
  estado_atual          String?   @db.VarChar(50)
  numero_avaliacoes     BigInt    @default(0)
  data_ultima_avaliacao DateTime? @db.Date
  palavras_chave        String?   @db.MediumText
}
```

### 6. Guias para o desenvolvimento

#### Estrtutura de pastas
|ráiz <br/>
__ |app: pasta pai da aplicação <br/>
____ | lib: pasta para instanciar o prisma <br/>
____ | components: pasta para abstrair os componentes da aplicação <br/>
____ | (pages): Rotas da aplicação, no next, as pastas são as rotas * <br/>
____ | layout.tsx: layout de todas as páginas ** <br/>
____ | page.tsx: página ráiz da aplicação <br/>
__ | components: componentes do shadcn <br/>
__ | prisma: pasta do ORM <br/>

*quando usamos uma pasta com () ela não participa das rotas, vide a documentação do next <br/>
** estrutura que envolve o {children}, onde todo o resto das rotas é renderizdo 
