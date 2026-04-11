Como Funciona
O usuário responde um quiz
Os dados são enviados para o backend
O sistema:
valida as respostas
identifica interesses principais
consulta o banco de dados
Retorna um plano estruturado
O frontend exibe o resultado

Tecnologias Utilizadas
Frontend: Next.js (App Router), React, TypeScript, TailwindCSS
Backend: API Routes (Next.js)
Banco de dados: Supabase (PostgreSQL)
Validação: Zod
IA: OpenAI

Estrutura do Projeto
src/
 ├── app/
 │   ├── page.tsx
 │   ├── layout.tsx
 │   └── api/
 │       └── submit/
 │           └── route.ts
 │
 ├── components/
 │   ├── hero.tsx
 │   └── quiz.tsx
 │
 ├── lib/
 │   ├── schema.ts
 │   ├── prompt.ts
 │   └── supabase.ts

Fluxo da Aplicação
Usuário → Formulário → API → Banco de Dados → Resultado → Interface
