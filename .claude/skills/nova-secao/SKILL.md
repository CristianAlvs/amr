---
name: nova-secao
description: Cria uma seção nova da landing page de ponta a ponta — componente, estilos, copy, registro no home e na navbar, e verificação de build. Use quando pedirem "cria a seção X", "adiciona um bloco de Y na landing" ou para preencher um componente que ainda está com placeholder "works!".
---

# Nova seção da landing page

Argumento esperado: o nome da seção e, se houver, o que ela deve conter.
Ex.: `/nova-secao doacoes — dados do PIX e um botão para dízimo online`

## 1. Definir o escopo antes de codar

Carregue a skill `design-system` para ter tokens e padrões em mente.

Decida (e declare ao usuário em duas linhas, sem pedir aprovação para o óbvio):
- **onde a seção entra** na ordem de [home.component.html](../../../src/app/home/home.component.html) —
  hoje: hero → sobre → agenda (bloco escuro, já inclui a chamada do canal) → contato
- **o layout**: grid de cards, texto+mídia, faixa de destaque (CTA) ou lista cronológica
- **se entra na navbar** — só seções âncora relevantes entram

Se faltar informação real (endereço, chave PIX, datas, telefone), siga em frente com marcador
`[CONFIRMAR: …]` no texto e liste as pendências no fim. Não invente dado factual da igreja.

## 2. Escrever a copy

Delegue ao agente `redator-ptbr` com o tema da seção e a lista de blocos de texto necessários
(eyebrow, título, subtítulo, cards, CTA). Tom pastoral, pt-BR, sem marketing agressivo.

## 3. Implementar

Delegue ao agente `construtor-secao`, passando no prompt: nome da seção, layout escolhido, a copy
aprovada do passo 2 e onde ela entra na página. Ele escreve `.ts` / `.html` / `.scss`, registra em
`home.component.ts` + `home.component.html` e, se aplicável, na navbar.

Se a seção usa um card que já existe em `src/app/shared/ui/`, reaproveite; se o card é novo e vai
se repetir, crie-o em `shared/ui/` com `input()` tipados em vez de duplicar markup.

## 4. Revisar

Dispare em paralelo `revisor-design` e `revisor-a11y-seo` sobre os arquivos criados. Aplique as
correções de severidade `[bloqueante]`, `[AA]` e `[token]`. Melhorias opcionais: liste para o
usuário decidir, não aplique em silêncio.

## 5. Verificar de verdade

```bash
npm run build
```

O build tem que passar, sem warning de orçamento (4kB por estilo de componente). Se o usuário
quiser ver rodando, use a skill `preview`.

## Entrega

Reporte: arquivos criados/alterados, onde a seção foi registrada, tokens novos (se houve),
pendências `[CONFIRMAR]` e o resultado do build. Nada de "pronto" sem build verde.
