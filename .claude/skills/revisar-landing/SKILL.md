---
name: revisar-landing
description: Revisão completa da landing page em quatro frentes paralelas — design system, acessibilidade/SEO, código Angular e copy pt-BR. Use antes de publicar, depois de um lote grande de mudanças, ou quando pedirem "revisa a página".
---

# Revisão completa da landing

Argumento opcional: escopo (`/revisar-landing hero` revisa só o hero). Sem argumento, revisa
`src/` inteiro.

## 1. Base

```bash
npm run build
```

Capture erros, warnings de orçamento e o tamanho do bundle inicial — entram no relatório final.

## 2. Quatro revisores em paralelo

Dispare os quatro agentes **numa única mensagem**, cada um com o escopo definido acima:

| Agente | Frente |
| --- | --- |
| `revisor-design` | tokens, mixins, BEM, responsividade, orçamento de CSS |
| `revisor-a11y-seo` | WCAG AA, semântica, teclado, meta tags, JSON-LD |
| `revisor-angular` | bugs, control flow moderno, vazamentos, performance |
| `redator-ptbr` | gramática, tom pastoral, consistência de voz (modo revisão) |

## 3. Consolidar

Junte os achados num só relatório, deduplicado, ordenado por severidade:

1. `[bloqueante]` — quebra funcional, build ou uso impossível
2. `[AA]` — falha de acessibilidade
3. `[token]` / `[padrão]` — violação de convenção do projeto
4. `[melhoria]` — opcional

Achado de agente não é verdade automática: confirme no arquivo antes de listar. Descarte o que
não se sustentar na leitura do código.

## 4. Corrigir

Aplique sozinho o que é mecânico e sem risco: token errado, `@media` virando mixin, `alt`
faltando, `rel="noopener noreferrer"`, `track` no `@for`. Mudanças que alteram layout, texto
publicado ou comportamento: apresente e pergunte.

Depois das correções, rode `npm run build` de novo e informe o resultado.

## Entrega

Relatório em markdown no terminal: contagem por severidade, lista com `arquivo:linha`, o que foi
corrigido, o que ficou pendente e por quê, e o tamanho do bundle antes/depois se mudou.
