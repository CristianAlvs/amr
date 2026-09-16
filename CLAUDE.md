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
  app.component.ts         shell: skip-link + <router-outlet> + footer; assina
                           NavigationEnd para SEO, re-varredura de animação e
                           a classe .route-jump
  app.routes.ts            3 rotas: '' (home, eager) e as duas páginas (lazy)
  home/
    home.component.html    ordem das seções da landing
    sections/<nome>/       uma seção da página (hero, sobre, agenda, contato, ...)
  pages/                   páginas de leitura longa, uma rota cada:
                           william-branham, pontos-doutrinarios
  layout/                  navbar, footer, page-header, artigo-nav — a navbar é
                           renderizada por hero.component.html, dentro do próprio
                           hero; não há barra fixa, ela rola junto e sai de cena
                           com ele. O page-header é a faixa de título das rotas
                           de /pages, e o artigo-nav a navegação lateral delas
  shared/ui/               cards (culto-card, pastor-card, schedule-event) — todos ainda
                           placeholder; ver Pendências
  shared/directives/       blocos-recolhiveis: os <details> das páginas de leitura
  services/                scroll-reveal (observer de animação), seo (title/meta
                           por rota), send-email (stub)
src/styles/
  abstracts/_tokens.scss   TODAS as CSS custom properties (cores, fontes, espaços, sombras)
  abstracts/_mixins.scss   @include tablet/mobile/small, card-hover, label-uppercase
  base/, layout/, components/   reset, tipografia, .container, .btn, animações e os três
                           arquivos de .artigo (base, figura, leitura)
```

**Rotas.** O site deixou de ser de página única quando ganhou `/william-branham` e
`/pontos-doutrinarios`. A home continua eager (é o LCP); as duas páginas são `loadComponent`.

**Âncora de seção nunca navega.** Nem `href="#x"`, nem `routerLink` + `fragment` — use sempre a
[AncoraDirective](src/app/shared/directives/ancora.directive.ts):

```html
<a amrAncora="agenda">Agenda</a>              <!-- seção desta mesma página -->
<a amrAncora="agenda" rota="/">Agenda</a>     <!-- rodapé: a seção mora na home -->
```

Os dois caminhos antigos escreviam na URL, e cada um do seu jeito ruim. O `href="#x"` cru dispara
`popstate`, o router reprocessa a URL e o `anchorScrolling` rola uma segunda vez. O
`routerLink` + `fragment` faz uma navegação de verdade: a barra vira `/#sobre`, o fragmento
**fica congelado** ali enquanto o leitor rola para outras seções — a URL passa a mentir sobre
onde ele está — e cada clique empilha uma entrada no histórico. No índice lateral de
`/william-branham`, com nove seções, sair pelo botão Voltar chegava a exigir nove cliques.

A diretiva mantém um `href` real (`/#agenda`), então nova aba, copiar link e leitor de tela
continuam funcionando; ela só intercepta o clique comum, rola e move o foco para a seção. Clique
com Ctrl/Cmd/Shift ou do meio passa direto. Se o alvo não estiver na página (o rodapé visto de
uma página de leitura), aí sim navega — para `rota`, **sem fragmento**.

`routerLink` continua sendo o certo para troca de rota de verdade: `/william-branham`,
`/pontos-doutrinarios`, `/`.

Duas consequências que não são óbvias:

- **`anchorScrolling` continua ligado**, e agora só por causa do link colado: abrir o site direto
  em `/#agenda` tem de cair na seção. O site deixou de *escrever* fragmento, não de *ler* um.
  Como nenhum clique navega mais com fragmento, o risco de rolagem dupla sumiu junto.
- **`scroll-behavior: smooth`** do reset faria o `scrollTo(0,0)` do router animar a página
  inteira na troca de rota. O AppComponent põe `.route-jump` no `<html>` durante navegações sem
  fragment; `_reset.scss` zera o smooth nessa classe. É também por isso que a diretiva chama
  `scrollIntoView` **sem passar `behavior`** na rolagem da mesma página: assim vale o smooth do
  reset e, junto, o `prefers-reduced-motion` que o zera. Passar `'smooth'` na mão atropelaria a
  preferência do usuário.

**Texto de leitura longa** usa as classes globais `.artigo__*` e o token `--measure` (68ch) para a
largura da coluna — `--container-max` (1140px) é largo demais para texto corrido. São globais, e
não SCSS de componente, porque as duas páginas compartilham o mesmo estilo e o budget de
`anyComponentStyle` é 4 kB. São três arquivos, divididos por assunto:

- [_artigo.scss](src/styles/components/_artigo.scss) — `.artigo-layout`, a prosa base, `__bloco`,
  `__citacao`, `__par` e `__fim`
- [_artigo-figura.scss](src/styles/components/_artigo-figura.scss) — `__figura` e variantes
- [_artigo-leitura.scss](src/styles/components/_artigo-leitura.scss) — `__resumo`, `__lede`,
  `__importa`, `__pontos`, `__fundo` e `__linha-do-tempo`

**A prosa base é `:where(.artigo)`, e isso não é enfeite.** Aninhada como `.artigo { p { … } }` ela
compilava para `.artigo p`, especificidade (0,1,1), e atropelava qualquer primitiva que **seja** um
`<p>` — `.artigo__lede` e `.artigo__importa` são (0,1,0) e simplesmente não tinham efeito. O
`:where()` zera a especificidade do pai; `.artigo__citacao p` continua ganhando. Ao acrescentar uma
primitiva nova, mantenha esse contrato.

**Nada de caixa.** As citações e os pares Jeová/Jesus já foram blocos com fundo tingido, raio e
filete de 4px — 42 deles entre as duas páginas, e o efeito era o de uma página gerada em série,
sem hierarquia nenhuma. O repertório agora é fio, recuo, escala, peso e cor. Uma primitiva de
leitura nova não ganha `background`, `border-radius` nem `box-shadow`. O único destaque forte é
`.artigo__citacao--chave`, **uma por seção no máximo** — e só para Escritura: dar a ela uma frase
que não é versículo faz uma paráfrase humana parecer texto bíblico.

`.artigo-layout` é o grid `1fr --measure 1fr`: a coluna de texto fica exatamente onde ficaria se
estivesse sozinha e centrada — o que alinha o `h1` da faixa de cabeçalho ao corpo do artigo —, e
a navegação lateral ocupa a calha esquerda. Essa calha só passa de ~190px a partir de 1188px de
viewport, e é por isso que existe `@include desktop` ($bp-desktop: 1200px), **o único mixin de
min-width do projeto**. Abaixo disso o grid volta a uma coluna e a navegação vira um bloco acima
do texto — o mesmo DOM, sem duplicação.

A calha **esquerda está ocupada**: a `app-artigo-nav` é sticky e fica lá em qualquer posição de
rolagem. Por isso a marginalia (`.artigo__figura--calha`) e a sangria de `--grande` vão para a
direita, que o grid declara vaga. A largura sai de `--artigo-calha`, calculada em CSS a partir de
`--measure` — nunca em pixel fixo, porque `ch` muda se a Inter ainda não tiver carregado. E nada
de `100vw` numa sangria: inclui a barra de rolagem e cria overflow horizontal.

**Leitura em camadas (Brevidade Inteligente).** As duas páginas guardam a prosa integral dentro de
`<details class="artigo__fundo">`; o que fica aberto é lede, "Por que isso importa" e pontos. Duas
consequências:

- **Nunca ponha `.animate-on-scroll` dentro de um `<details>`.** Fechado, os filhos ficam
  `display: none`, o observer nunca dispara e o `scan()` só re-roda em `NavigationEnd`.
- Abrir ou fechar muda a altura do documento **sem disparar `scroll` nem `resize`**, e o
  `ArtigoNavComponent` só recalcula nesses dois eventos. Quem resolve é a
  [BlocosRecolhiveisDirective](src/app/shared/directives/blocos-recolhiveis.directive.ts), no
  `<article class="artigo">`: escuta `toggle` **na fase de captura** (esse evento não borbulha) e
  despacha um `resize` sintético. Ela também abre todo `<details>` no `beforeprint` — um bloco
  fechado não vai ao papel, e sem isso imprimir a página perderia justamente o texto completo.

O destaque da seção em leitura no `artigo-nav` é decidido por rolagem, comparando o topo de cada
seção com uma linha fixa, e **não** por IntersectionObserver: as seções destas páginas chegam a
ser várias vezes mais altas que a janela, e nessa escala um threshold de IO ou nunca dispara ou
acende duas seções ao mesmo tempo. O `scroll-margin-top` de `.artigo__bloco` precisa ficar abaixo
da `LINHA_DE_LEITURA` do componente, senão a seção clicada para acima da linha e o destaque
acende na seguinte.

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
  - `animate-on-scroll` + `data-delay="0|100|200"` → revelado pelo IntersectionObserver do
    [scroll-reveal.service.ts](src/app/services/scroll-reveal.service.ts) ao entrar na viewport.
    O AppComponent re-varre a cada `NavigationEnd` (dentro de `afterNextRender`), então conteúdo
    que nasce numa troca de rota é pego. O que **não** é pego é conteúdo criado fora de navegação
    (um `@if` que abre depois) — esse nasce `opacity: 0` e fica invisível.
    Não use em bloco mais alto que ~8× a viewport: o `threshold: 0.1` nunca é alcançado e o bloco
    não aparece. É por isso que os `.artigo__bloco` das páginas de leitura não animam — mas os
    `.artigo__marco` da linha do tempo animam, e pelo mesmo motivo invertido: cada marco tem
    120–220px, e quem é observado é o `<li>`, não a seção. Sem `data-delay` nesses: o serviço
    empurra um `setTimeout` por elemento, e dez marcos escalonados fazem o último acender com
    segundos de atraso em rolagem rápida.
  - `animate-fade-up` + `style="--delay: 200ms"` → anima sozinho na carga, via CSS. Não usa
    `data-delay`; é o padrão do hero, acima da dobra, e o caminho seguro para conteúdo de rota,
    porque não depende de observer nenhum.
- Ícones são **SVG inline** com `stroke="currentColor"` e `aria-hidden="true"` (linha Feather,
  `stroke-width="1.5"` em ícones de 40px, `2` nos de 16px). Não instalar biblioteca de ícones.

## Componentes

- Standalone (`imports: []` no decorator), sem NgModule.
- Registrar a seção nova em [home.component.ts](src/app/home/home.component.ts) (`imports`) **e** em
  [home.component.html](src/app/home/home.component.html) na posição certa.
- Link de navegação novo → adicionar `<li>` em [navbar.component.html](src/app/layout/navbar/navbar.component.html)
  **e** em [footer.component.html](src/app/layout/footer/footer.component.html): `amrAncora="x"` na
  navbar, `amrAncora="x" rota="/"` no rodapé (ver Rotas — nunca `href="#"` nem `fragment`); o `id`
  da `<section>` precisa bater.
  Não existe destaque de seção ativa: a nav vive dentro do hero e sai de cena antes de qualquer
  outra seção entrar. O rodapé é a única navegação depois da dobra **e** a única de volta das
  páginas de leitura, já que vive no shell, fora do `<router-outlet>`.
- Página de leitura nova → componente em `pages/`, rota com `loadComponent` e `data`
  (title/description/canonical) em [app.routes.ts](src/app/app.routes.ts), `<app-page-header>` no
  topo e `id="conteudo" tabindex="-1"` no wrapper do artigo — o skip-link do shell aponta para
  esse id em **todas** as rotas. Se ela tiver blocos "Vá mais fundo", o mesmo wrapper leva
  `amrBlocosRecolhiveis`. E a `<section>` nova só aparece na navegação lateral se entrar também no
  array `secoes` do TS — o spec da página conta os itens, então ele muda junto.

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
