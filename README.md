# A Mensagem Revelada

Landing page da **Igreja Evangélica Tabernáculo da Fé** — Santo Amaro, São Paulo.
Página única com a apresentação da igreja, a programação semanal de cultos e um canal de contato,
apontando para as transmissões no [canal do YouTube](https://www.youtube.com/@amensagemrevelada).

Pastor: Waltair Borges Vitória.

## Stack

Angular 19 com componentes standalone (sem NgModule), SCSS puro com design tokens e **nenhuma
biblioteca de UI**. Os ícones são SVG inline e as fontes são auto-hospedadas — a página não faz
requisição a CDN nem a serviço de terceiros.

| | |
|---|---|
| Framework | Angular 19.2 |
| Estilo | SCSS, tokens em CSS custom properties |
| Formulário | Reactive Forms |
| Testes | Karma + Jasmine |
| Fontes | Waylimo (display) e Inter (corpo), WOFF2 subset latino |

## Começando

```bash
npm install
npm start      # http://localhost:4200
```

| Comando | O que faz |
|---|---|
| `npm start` | Servidor de desenvolvimento com recarga automática |
| `npm run build` | Build de produção em `dist/amr` |
| `npm run watch` | Build de desenvolvimento em modo contínuo |
| `npm test` | Testes unitários |

## Estrutura

```
src/app/
  app.component.ts          home + footer; IntersectionObserver das animações de entrada
  home/
    home.component.html     ordem das seções da página
    sections/<nome>/        uma seção (hero, sobre, agenda, contato, ...)
  layout/                   navbar e footer
  shared/ui/                cards reutilizáveis
  services/
src/styles/
  abstracts/_tokens.scss    todas as CSS custom properties
  abstracts/_mixins.scss    breakpoints, fundo de montanhas, utilitários
  base/ layout/ components/ reset, tipografia, container, botões, formulários, animações
public/                     fontes, logotipos e o fundo em três larguras
```

A navegação **não é uma barra fixa**: ela vive dentro do hero e sai de cena junto com ele. Depois
da primeira dobra, quem navega é o rodapé.

## Design

A paleta oficial tem 8 cores, expostas como `--brand-*` e consumidas por papéis semânticos
(`--color-primary`, `--color-accent`…). Três regras valem em todo o código:

- **Zero valores hardcoded.** Cor, espaçamento, fonte, raio, sombra e transição saem de
  `var(--token)`. Valor novo entra primeiro em `_tokens.scss`.
- **BEM com nesting `&__`** — `.agenda`, `.agenda__grid`, `.culto-card--featured`.
- **Media queries só pelos mixins** `@include tablet/mobile/small`, nunca `@media` direto no
  componente.

O fundo de montanhas do hero usa um véu **graduado**, calibrado por medição para manter o texto em
4,5:1 e o título em 3:1. Mexer na altura do hero muda o recorte da foto e exige revalidar esse
contraste.

As convenções completas — anatomia de uma seção, padrões de card, quando usar cada animação de
entrada — estão em [CLAUDE.md](CLAUDE.md).

## Estado atual

- O formulário de contato **não tem backend**. O `SendEmailService` rejeita de propósito, para que
  a interface nunca diga ao visitante que a mensagem foi entregue quando não foi. Ligue-o a um
  destino real (Formspree, EmailJS, Resend ou função própria) antes de publicar.
- Alguns componentes gerados pelo CLI ainda estão com markup placeholder: `sections/pastoral`,
  `sections/cta`, `shared/ui/culto-card`, `shared/ui/pastor-card`, `shared/ui/schedule-event`.
- A arte-fonte da marca não é versionada aqui: o que vai para a web são as versões processadas em
  `public/`.
