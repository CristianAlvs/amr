---
name: preview
description: Sobe o dev server do Angular e confirma que a página responde, com a porta livre e logs capturados. Use quando pedirem para rodar, abrir, servir ou "ver funcionando" o projeto AMR.
---

# Rodar o AMR localmente

## 1. Verificar dependências

Se `node_modules/` não existir:

```bash
npm ci
```

## 2. Subir o servidor

Sempre em background — `ng serve` não termina sozinho e travaria a sessão:

```bash
npm start -- --port 4200
```

(usar `run_in_background: true`). Se a porta estiver ocupada, escolha outra (4201, 4299…) e
avise o usuário qual foi usada.

## 3. Confirmar que subiu

Não declare "está no ar" sem checar. Aguarde a compilação e teste:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4200/
```

Esperado `200`. Se demorar, leia o arquivo de output da tarefa em background antes de concluir
qualquer coisa — erro de compilação aparece lá.

## 4. Reportar

Informe a URL (`http://localhost:4200/`), o que mudou desde a última vez, e lembre que o
hot reload já está ativo — editar `src/` recompila sozinho.

## Encerrar

Pare a tarefa em background quando o usuário terminar, ou antes de subir outra instância na
mesma porta.

## Build de produção

Para conferir o artefato final em vez do dev server:

```bash
npm run build     # saída em dist/amr, com orçamento: 4kB/8kB por estilo, 500kB/1MB no inicial
```
