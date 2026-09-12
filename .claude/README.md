# Configuração do Claude Code — AMR

Estrutura que ensina o Claude a trabalhar neste projeto sem precisar reexplicar as convenções a
cada sessão.

```
CLAUDE.md                  ← carregado automaticamente toda sessão: arquitetura e regras do projeto
.claude/
  settings.json            permissões (build/test liberados, push e rm -rf bloqueados)
  skills/                  fluxos invocáveis com "/"
    design-system/         referência de tokens, mixins, BEM, anatomia de seção
    nova-secao/            cria uma seção inteira: copy → código → revisão → build
    revisar-landing/       revisão em 4 frentes paralelas + correções
    preview/               sobe o dev server e confirma que respondeu
  agents/                  subagentes especializados (rodam em contexto próprio, em paralelo)
    construtor-secao.md    escreve HTML+SCSS+TS da seção e registra no home/navbar
    revisor-design.md      audita SCSS contra os tokens e mixins
    revisor-a11y-seo.md    WCAG AA, semântica, meta tags, JSON-LD
    revisor-angular.md     bugs, control flow moderno, vazamentos, bundle
    redator-ptbr.md        copy em pt-BR no tom pastoral do projeto
```

## Como usar

**Comandos diretos:**

```
/nova-secao doacoes — dados do PIX e botão de dízimo online
/revisar-landing
/revisar-landing hero
/preview
/design-system              (só carrega a referência, útil antes de mexer em estilo)
```

**Pedidos em linguagem natural** também disparam a skill certa — "cria uma seção de
depoimentos", "revisa a acessibilidade da página", "roda o projeto".

**Chamar um subagente específico:** "usa o revisor-design nos estilos do hero".

## Onde mexer quando algo mudar

- Token de cor/espaço novo → `src/styles/abstracts/_tokens.scss` **e** a tabela em
  `skills/design-system/SKILL.md`
- Convenção nova de código → `CLAUDE.md`
- Critério novo de revisão → o agente correspondente em `agents/`

Os arquivos são markdown comum: edite à vontade, sem build nem instalação.
