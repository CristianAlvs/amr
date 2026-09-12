---
name: design-system
description: Referência do design system do AMR — tokens, mixins, convenções BEM, anatomia de seção, padrões de card e botão. Carregue antes de escrever ou revisar qualquer HTML/SCSS deste projeto, ou quando precisar saber qual token usar para uma cor, espaçamento, sombra ou breakpoint.
---

# Design system — A Mensagem Revelada

Identidade oficial em [`design/Breve-Apresentação.pdf`](../../../design/Breve-Apresentação.pdf):
**Waylimo** (display) + **Inter** (corpo) · azul petróleo `#155F82` com acento dourado `#CB912E`
sobre neutros claros. Visual sóbrio e institucional; fotografia de montanhas enevoadas como
textura de fundo.

## Tokens

Todos em [`src/styles/abstracts/_tokens.scss`](../../../src/styles/abstracts/_tokens.scss),
declarados em `:root`. Consuma sempre com `var(--nome)`.

| Grupo | Tokens |
| --- | --- |
| Paleta bruta | `--brand-azul` `#155F82` · `--brand-azul-nevoa` `#A8BDD7` · `--brand-marinho` `#092648` · `--brand-carvao` `#0E1E2E` · `--brand-areia` `#D8DACD` · `--brand-dourado` `#CB912E` · `--brand-dourado-claro` `#C9A35C` · `--brand-bronze` `#98733D` |
| Marca | `--color-primary` · `--color-primary-dark` · `--color-primary-light` · `--color-primary-bg` |
| Acento | `--color-accent` · `--color-accent-soft` · `--color-accent-deep` |
| Fundo | `--color-bg` · `--color-bg-white` · `--color-surface` · `--color-surface-muted` |
| Escuro | `--color-dark` · `--color-dark-soft` |
| Texto | `--color-text` · `--color-text-muted` · `--color-text-subtle` |
| Texto em fundo escuro | `--color-text-on-dark` · `--color-text-on-dark-muted` |
| Traços | `--color-border` · `--color-border-strong` · `--color-border-dark` |
| Estado | `--color-danger` · `--color-success` · `--color-success-bg` |
| Fonte | `--font-display` (Waylimo) · `--font-body` (Inter) |
| Escala | `--text-xs` … `--text-6xl` |
| Letra | `--tracking-label` `0.18em` · `--tracking-wide` |
| Espaço | `--space-1` … `--space-24` |
| Layout | `--container-max` 1140px · `--container-pad` · `--nav-height` 64px · `--section-py` · `--section-header-mb` · `--gap-col` |
| Raio | `--radius-sm/md/lg/full` |
| Sombra | `--shadow-sm/md/lg` |
| Transição | `--transition-fast/base/slow` |
| Imagem | `--bg-montanhas` |

Faltou um valor? **Adicione o token em `_tokens.scss`** e use a variável — nunca hardcode no
componente.

## Tipografia — a regra que mais se erra

`--font-display` é a **Waylimo**, que tem **apenas o peso 400 e nenhum itálico**. Escrever
`font-weight: 700` ou `font-style: italic` sobre ela faz o navegador sintetizar o estilo, e o
resultado destoa do logotipo. Para dar hierarquia use `font-size`.

O destaque dentro de um `.section__title` — a tag `<em>` — é **dourado**, não inclinado.

Corpo, rótulos e botões usam **Inter**: 300 (descrições), 400 (texto), 600 (rótulos), 700 (botões).

## Mixins

[`src/styles/abstracts/_mixins.scss`](../../../src/styles/abstracts/_mixins.scss), importado com
`@use 'abstracts/mixins' as *;` (o `includePaths` do `angular.json` resolve o caminho).

- `@include tablet { }` → `max-width: 1024px`
- `@include mobile { }` → `max-width: 768px`
- `@include small  { }` → `max-width: 480px`
- `@include card-hover($translate: -6px)` → elevação + sombra + borda superior azul
- `@include label-uppercase` → 0.75rem, 700, letter-spacing 0.15em, caixa alta

Nunca escreva `@media` direto num componente.

## Classes globais

De [`_container.scss`](../../../src/styles/layout/_container.scss),
[`_buttons.scss`](../../../src/styles/components/_buttons.scss) e
[`_animations.scss`](../../../src/styles/components/_animations.scss):

- `.container` — largura máxima + padding lateral
- `.section`, `.section__header`, `.section__eyebrow`, `.section__title`, `.section__subtitle`
- `.btn` + `--primary` `--accent` `--outline` `--white` `--ghost-light` `--large` `--full`; `.btn-row` para linha de botões que quebra sozinha
- `.form__*` e `.social__*` em [`_forms.scss`](../../../src/styles/components/_forms.scss) — globais, não do componente de contato
- `.animate-fade-up` (anima na carga) · `.animate-on-scroll` + `.visible` (anima ao entrar na tela)
- `:focus-visible` global com outline azul — não sobrescreva com `outline: none`

## Anatomia de seção

```html
<section class="section <nome>" id="<nome>">
  <div class="container">
    <header class="section__header animate-on-scroll">
      <span class="section__eyebrow">Rótulo</span>
      <h2 class="section__title">Nossos <em>Cultos</em></h2>
      <p class="section__subtitle">Linha de apoio</p>
    </header>
    <div class="<nome>__grid"> … </div>
  </div>
</section>
```

```scss
@use 'abstracts/mixins' as *;

.<nome> {
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }

  @include tablet { &__grid { grid-template-columns: 1fr 1fr; } }
  @include mobile { &__grid { grid-template-columns: 1fr; } }
}
```

Alterne o fundo entre seções vizinhas (`--color-bg` ↔ `--color-bg-white`) para dar ritmo à página.

## Padrão de card

Referência: `.culto-card` em
[`culto-card.component.scss`](../../../src/app/shared/ui/culto-card/culto-card.component.scss).
Hoje **nenhuma seção viva usa esse padrão** — a página só tem a lista da agenda
(`.schedule-event`) e o card lateral de CTA. Use-o ao criar uma seção nova em grade de cards.

Fundo branco · `--radius-md` · `--shadow-sm` · `border-top: 4px solid transparent` que vira
`--color-primary` no hover, junto de `translateY(-8px)` e `--shadow-lg`. Modificador
`--featured` já nasce com a borda azul e `--shadow-md`.

Estrutura interna: ícone SVG → label em caixa alta → `h3` serifado azul → descrição → rodapé com
ícone + informação, separado por `border-top`.

## Ícones

SVG inline, traço (estilo Feather), `fill="none"`, `stroke="currentColor"`,
`stroke-width="1.5"` a 40px e `2` a 16px, sempre `aria-hidden="true"` quando decorativo. A cor
vem do `color` do container pai. Não instalar biblioteca de ícones.

## Animação de entrada

Adicione `animate-on-scroll` e `data-delay="0"`, `"100"`, `"200"`… ao elemento. O
`IntersectionObserver` em [`app.component.ts`](../../../src/app/app.component.ts) adiciona
`.visible` com o atraso indicado, no threshold de 0.1, e depois para de observar. Elementos
criados dinamicamente depois do `ngAfterViewInit` **não** são observados.
