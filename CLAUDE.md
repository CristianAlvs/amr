# AMR — A Mensagem Revelada

Landing page single-page da Igreja Evangélica Tabernáculo da Fé (Santo Amaro · SP).
Angular 19 standalone, SCSS puro com design tokens, sem UI library.

A identidade visual oficial está em [design/Breve-Apresentação.pdf](design/Breve-Apresentação.pdf)
(paleta de 8 cores, logotipo, aplicações). Os arquivos-fonte — PDF, foto de fundo original e os
TTF — ficam em [design/](design/) e **não** são publicados; o que vai para a web são as versões
processadas em `public/`.

## Comandos

```bash
npm start          # ng serve  → http://localhost:4200
npm run build      # build de produção em dist/amr
npm test           # karma + jasmine
```

## Arquitetura

```
src/app/
  app.component.ts         home + footer; IntersectionObserver global de animação
  home/
    home.component.html    ordem das seções da landing
    sections/<nome>/       uma seção da página (hero, sobre, agenda, contato, ...)
  layout/                  navbar, footer — a navbar é renderizada por
                           hero.component.html, dentro do próprio hero; não há
                           barra fixa, ela rola junto e sai de cena com ele
  shared/ui/               cards (culto-card, pastor-card, schedule-event) — todos ainda
                           placeholder; ver Pendências
  services/
src/styles/
  abstracts/_tokens.scss   TODAS as CSS custom properties (cores, fontes, espaços, sombras)
  abstracts/_mixins.scss   @include tablet/mobile/small, card-hover, label-uppercase
  base/, layout/, components/   reset, tipografia, .container, .btn, animações
```

`src/styles` está em `stylePreprocessorOptions.includePaths`, então dentro de qualquer
`.component.scss` o import é sempre:

```scss
@use 'abstracts/mixins' as *;
```

## Marca

- **Paleta oficial (8 cores):** `#155F82` azul petróleo · `#A8BDD7` azul névoa · `#092648` marinho ·
  `#0E1E2E` carvão · `#D8DACD` areia · `#CB912E` dourado · `#C9A35C` dourado claro · `#98733D` bronze.
  Expostas como `--brand-*` e consumidas pelos papéis semânticos (`--color-primary`, `--color-accent`…).
- **Tipografia auto-hospedada** em `public/fonts/` (WOFF2, subset latino):
  - `--font-display` → **Waylimo**. Display geométrica, **só peso 400, sem bold e sem itálico
    reais**. Nunca aplique `font-weight: 700` ou `font-style: italic` sobre ela — o navegador
    sintetiza e deforma a marca. Presença vem do `font-size`.
  - `--font-body` → **Inter** (300 / 400 / 600 / 700).
- **Destaque em título** (`<em>` dentro de `.section__title`) é **cor dourada**, não itálico.
- **Fundo de montanhas** da marca: `@include fundo-montanhas($topo, $centro, $base, $pos, $tam)`.
  Servido de `public/` em três larguras (960 / 1600 / 2400). O véu é **graduado**: fraco no topo
  (a serra aparece) e forte na faixa central, onde o texto vive.
  **Mexeu na altura do hero? Revalide o contraste.** O recorte é ancorado na base, então uma
  altura menor mostra mais rocha escura e derruba o contraste — foi o que aconteceu ao compactar
  o hero de 702px para 490px. Mínimo: 4,5:1 na descrição, no botão outline e nos links da nav,
  3:1 no título. Com a nav dentro do hero a altura passou a vir só do conteúdo (o `min-height`
  não encosta mais), e o bloco cresce pelo topo — o pixel da foto sob cada glifo não muda, o que
  muda é o véu, cujas paradas são % da altura. Quem escorrega para a faixa de fade final é o
  botão outline; a alavanca é `$base`, e ela precisa ser repetida nos **dois**
  `@include fundo-montanhas` de `hero.component.scss` (o override de tablet reinstancia os
  defaults do mixin).

## Regras de estilo (não negociáveis)

- **Zero valores hardcoded.** Cor, espaçamento, fonte, raio, sombra e transição saem de
  `var(--token)` de [_tokens.scss](src/styles/abstracts/_tokens.scss). Precisa de um valor novo? Adicione o token lá primeiro.
- **BEM com nesting `&__`**: `.agenda`, `.agenda__grid`, `.schedule-event`,
  `.schedule-event__time`, `.culto-card--featured`.
- **Media queries só pelos mixins** `@include tablet`, `@include mobile`, `@include small` —
  nunca escrever `@media (max-width: ...)` direto no componente. Antes disso, prefira
  `repeat(auto-fit, minmax(Xpx, 1fr))`: resolve a faixa de tablet sem criar mais um estado.
- **Espaçamento de seção é fluido**: `--section-py`, `--section-header-mb` e `--gap-col` já são
  `clamp()`. Não use `--space-*` fixo para respiro de seção ou vão entre colunas.
- **Alvo de toque mínimo de 44px** em qualquer controle (`.btn` já garante).
- **Sem `styles` inline no decorator**; sempre `styleUrl` apontando para o `.scss` irmão.
- Orçamento de build: estilo por componente avisa em 4kB e falha em 8kB.

## Anatomia de uma seção

```html
<section class="section <nome>" id="<nome>">
  <div class="container">
    <header class="section__header animate-on-scroll">
      <span class="section__eyebrow">Rótulo</span>
      <h2 class="section__title">Texto <em>destacado</em></h2>
      <p class="section__subtitle">Linha de apoio</p>
    </header>

    <div class="<nome>__grid">
      <article class="<card> animate-on-scroll" data-delay="0">…</article>
      <article class="<card> animate-on-scroll" data-delay="100">…</article>
    </div>
  </div>
</section>
```

- `.section`, `.container`, `.section__header/eyebrow/title/subtitle/rule`, `.btn`, `.sr-only` e
  `.skip-link` já são globais.
- Duas animações de entrada, **com gatilhos diferentes**:
  - `animate-on-scroll` + `data-delay="0|100|200"` → revelado pelo IntersectionObserver em
    [app.component.ts](src/app/app.component.ts) ao entrar na viewport. Ele só observa elementos
    presentes no `ngAfterViewInit`, então conteúdo criado depois **nunca fica visível**
    (nasce `opacity: 0`).
  - `animate-fade-up` + `style="--delay: 200ms"` → anima sozinho na carga, via CSS. Não usa
    `data-delay`; é o padrão do hero, acima da dobra.
- Ícones são **SVG inline** com `stroke="currentColor"` e `aria-hidden="true"` (linha Feather,
  `stroke-width="1.5"` em ícones de 40px, `2` nos de 16px). Não instalar biblioteca de ícones.

## Componentes

- Standalone (`imports: []` no decorator), sem NgModule.
- Registrar a seção nova em [home.component.ts](src/app/home/home.component.ts) (`imports`) **e** em
  [home.component.html](src/app/home/home.component.html) na posição certa.
- Link de navegação novo → adicionar `<li>` em [navbar.component.html](src/app/layout/navbar/navbar.component.html)
  **e** em [footer.component.html](src/app/layout/footer/footer.component.html); o `id` da
  `<section>` precisa bater. Não existe mais destaque de seção ativa: a nav vive dentro do hero e
  sai de cena antes de qualquer outra seção entrar, então o rodapé é a única navegação disponível
  depois da dobra.

## Conteúdo e idioma

- Todo texto visível em **pt-BR**. `<html lang="pt-BR">`.
- Tom pastoral, acolhedor, sóbrio — sem linguagem de marketing agressivo ou urgência falsa.
- Dados reais do projeto: Pr. Waltair Borges Vitória; cultos Dom 8h (Companheirismo + Escola
  Dominical), Dom **16h30** e 18h (Pregação), Qua 19h30 (Oração); canal
  <https://www.youtube.com/@amensagemrevelada>. O horário da tarde é 16h30 conforme o manual da
  marca — o site já teve 16h00 em alguns pontos, não reintroduza.
- Links externos sempre com `target="_blank" rel="noopener noreferrer"`.

## Pendências conhecidas

Componentes gerados pelo CLI e ainda com markup placeholder (`<p>… works!</p>`):
`home/sections/pastoral`, `home/sections/cta`, `shared/ui/culto-card`,
`shared/ui/pastor-card`, `shared/ui/schedule-event`. O SCSS de `pastoral` já existe e define o grid.

Os `.spec.ts` são os gerados pelo CLI (só "should create"). Ao alterar um componente, atualize o
spec se o construtor passar a exigir inputs.
