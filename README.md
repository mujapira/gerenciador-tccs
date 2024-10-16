# Trabalho de banco de dados - gestão de TCCS's da fatec

Este é um projeto desenvolvido utilizando **Next.js 14**, **Prisma** como ORM e **MySQL** como banco de dados. O objetivo é gerenciar documentos acadêmicos, como monografias, pôsteres e artigos, oferecendo recursos para acompanhar o progresso dos alunos e relatórios para orientadores.

Documentações

https://ui.shadcn.com/docs

https://nextjs.org/docs

https://tailwindcss.com/docs

## Instalação

Siga os passos abaixo para configurar o projeto localmente:

### Clone o repositório

```bash
git clone git@github.com:mujapira/gerenciador-tccs.git
cd gerenciador-tccs
```

### Instale as dependências

```bash
npm install
```

### Inicie uma instância do mysql

- Abra o XAMPP, incie o mySQL, o Apache e crie um banco chamado fatec_tcc_v1
- Popule o banco usando os script de criação das tabelas no arquivo "CargasProBanco.txt"
- Alimenta o ORM com as informações do banco seguindo os passos abaixo

```bash
npx prisma db pull
npx prisma generate
```

### Rodando o projeto localmente

- Execute os comandos em abas separadas do console de sua IDE (vscode)
- O XAMPP deve estar aberto e executando o banco de dados

```bash
npx prisma studio
```

```bash
npm run dev
```

### Observações

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

### Guias para o desenvolvimento

#### Estrtutura de pastas
|root <br/>
__ |app: pasta pai da aplicação <br/>
____ | lib: pasta para instanciar o prisma <br/>
____ | components: pasta para abstrair os componentes da aplicação <br/>
____ | (pages): Rotas da aplicação, no next, as pastas são as rotas * <br/>
____ | layout.tsx: layout de todas as páginas ** <br/>
____ | page.tsx: página ráiz da aplicação <br/>
____ | models: modelos de transição dentre banco e app <br/>
____ | server-actions: ações que pegam dados do banco <br/>
__ | components: componentes do shadcn <br/>
__ | prisma: pasta do ORM <br/>

*quando usamos uma pasta com () ela não participa das rotas, vide a documentação do next <br/>
** estrutura que envolve o {children}, onde todo o resto das rotas é renderizdo 

### Tecnologias Utilizadas no Desenvolvimento do Projeto

### Next.js 14

Next.js é um framework de React que facilita a criação de aplicações web, proporcionando renderização híbrida (cliente e servidor). A versão 14 introduziu *Server Actions*, que permitem executar código no servidor diretamente a partir de componentes React. Neste projeto, isso eliminou a necessidade de um backend separado, pois foi possível interagir diretamente com o banco de dados.

### Prisma ORM

Prisma é uma ferramenta ORM (Object-Relational Mapping) que abstrai a comunicação com o banco de dados e facilita a escrita de queries usando TypeScript. Com o recurso *dbPull*, o Prisma lê a estrutura do banco de dados e automaticamente cria um modelo que reflete as regras de negócio, fornecendo autocompletar no código. Isso otimiza a experiência de desenvolvimento ao integrar o banco de dados ao código de maneira fluida e segura.

### MySQL e XAMPP

O **MySQL** é um sistema de gerenciamento de banco de dados relacional amplamente utilizado para armazenar e organizar dados. Durante o desenvolvimento inicial, utilizamos o **XAMPP**, um ambiente que facilita a instalação e execução do MySQL localmente. O XAMPP permitiu a criação e configuração do banco de dados, e, após essa fase, ele é mantido ativo apenas para rodar o banco de dados, permitindo manipulações por meio do Prisma na aplicação.

### ShadCN e TailwindCSS

O **ShadCN** é uma biblioteca baseada em **TailwindCSS**, um framework CSS utilitário que facilita o desenvolvimento de interfaces flexíveis e estilizadas. Combinado com o Tailwind, ShadCN oferece uma maneira rápida de construir componentes visuais, mantendo a flexibilidade e permitindo personalizações precisas sem escrever muito CSS manualmente.

### Razão das Escolhas

A combinação dessas tecnologias foi essencial para garantir a eficiência e agilidade no desenvolvimento. **Next.js 14** permitiu a interação direta com o banco de dados sem a necessidade de backend tradicional. **Prisma** garantiu uma integração perfeita com o MySQL, proporcionando autocompletar e segurança nas queries. **ShadCN** e **Tailwind** foram escolhidos para acelerar o desenvolvimento do front-end, garantindo uma interface rápida e responsiva.

## Regras de negócio

### 1. **Gestão de Alunos e Orientadores**

- **Alunos**:
    - Cada aluno é identificado de forma única por sua matrícula, CPF e e-mail, e está vinculado a uma turma.
    - O aluno pode estar associado a um TCC (Trabalho de Conclusão de Curso) e pode participar de comunidades acadêmicas.
- **Orientadores**:
    - Cada orientador tem um CPF, e-mail e nome únicos, além de ser vinculado a um departamento e possuir um título acadêmico.
    - Um orientador pode orientar vários alunos e ser responsável pela mudança de estado de um TCC, assim como participar de comunidades.

### 2. **Gestão de TCC**

- **Criação do TCC**:
    - O TCC é identificado pelo título e é vinculado a um aluno, orientador, turma, tema e classificação. Esta vinculação é gerida na tabela `tcc_metadata`.
- **Estado do TCC**:
    - Cada TCC tem um estado atual, que pode ser "Em Avaliação" (estado 1), "Aprovado" (estado 2), "Reprovado" (estado 3), ou "Pendente de Revisão" (estado 4).
    - O histórico de mudanças de estado do TCC é registrado, juntamente com o orientador responsável pela mudança, na tabela `tcc_estado_historico`.

### 3. **Regras para Avaliação de TCC**

- **Número de Avaliações**:
    - Cada TCC precisa de exatamente 3 avaliações para que a nota final seja calculada.
- **Cálculo da Nota Final**:
    - A média final do TCC será calculada com base nas notas das 3 avaliações, cada uma com valor entre 0 e 10.
    - A nota final é armazenada na tabela `tcc_nota_final` e, caso o TCC tenha menos de 3 avaliações, não será gerada uma nota final.
- **Atualização do Estado Baseado na Nota Final**:
    - **Aprovado**: O TCC será aprovado (estado 2) se a média das 3 avaliações for maior ou igual a 7,0.
    - **Reprovado**: O TCC será reprovado (estado 3) se a média das 3 avaliações for menor que 7,0.
    - **Em Avaliação**: O TCC permanecerá em "Em Avaliação" (estado 1) até que as 3 avaliações sejam realizadas.
- **Registro do Responsável pela Avaliação**:
    - Cada avaliação é registrada com a nota, a descrição e a data, e é vinculada ao orientador responsável por realizá-la.

### 4. **Gestão de Documentos do TCC**

- **Tipos de Documentos**:
    - Os tipos de documentos aceitos para submissão no TCC são Monografia, Artigo, Pôster, Apresentação, Relatório Parcial, e Outros.
- **Submissão de Documentos**:
    - Os documentos são vinculados ao TCC e podem ser enviados em diferentes formatos, como PDF, DOCX, etc., e a data de envio é registrada.
    - O caminho do arquivo e o tamanho do arquivo são armazenados para fins de gerenciamento.
- **Relatórios de Progresso**:
    - Os alunos podem submeter relatórios de progresso ao longo do desenvolvimento do TCC, cada um contendo a data de entrega, descrição, e arquivos associados.
    - Os arquivos de relatório são geridos separadamente na tabela `tcc_relatorio_progresso_arquivo`.

### 5. **Bibliografia do TCC**

- **Referências Bibliográficas**:
    - Cada TCC pode conter uma lista de referências bibliográficas associadas, que são armazenadas na tabela `tcc_bibliografia`.
    - A bibliografia contém a referência em formato textual e está vinculada ao TCC específico.

### 6. **Classificação de Trabalhos**

- **Classificação por Temas e Palavras-Chave**:
    - Cada TCC é classificado com base em um tema predefinido, como "Inteligência Artificial", "Blockchain", etc., e essas classificações são geridas na tabela `tcc_classificacao`.
    - O TCC também pode ser associado a múltiplas palavras-chave para facilitar sua categorização e pesquisa.

### 7. **Comunidades Acadêmicas**

- **Criação e Gestão de Comunidades**:
    - Alunos e orientadores podem criar e participar de comunidades acadêmicas. Uma comunidade tem um nome, descrição, e data de criação, e pode ser criada tanto por alunos quanto por orientadores.
- **Seguidores e Participação**:
    - Comunidades podem ter seguidores, que podem ser alunos ou orientadores. A data em que começaram a seguir a comunidade é registrada.
- **Posts nas Comunidades**:
    - Tanto alunos quanto orientadores podem fazer posts nas comunidades, que contêm o conteúdo e a data de postagem.

### 8. **Associação entre Alunos e Turmas**

- **Vinculação de Alunos às Turmas**:
    - Cada aluno pode estar vinculado a uma turma específica, e essa associação é feita na tabela `aluno_turma`. Alunos podem ser associados a mais de uma turma ao longo de seu curso.