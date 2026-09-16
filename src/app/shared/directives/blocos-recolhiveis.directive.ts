import { Directive, ElementRef, HostListener, NgZone, OnDestroy, inject } from '@angular/core';

/**
 * Faz os `<details>` de uma página de leitura conviverem com o resto da página.
 * Vai no `<article class="artigo">`, uma vez por página, e cuida dos dois
 * pontos em que um `<details>` nativo não se basta aqui:
 *
 * 1. **Impressão.** A prosa integral das páginas mora dentro dos blocos "Vá mais
 *    fundo", e um `<details>` fechado não vai ao papel. Nenhum CSS resolve isso
 *    em todos os navegadores — `::details-content` cobre os recentes (a regra
 *    está no `@media print` de styles.scss) e isto cobre o resto. Sem os dois,
 *    imprimir uma página de doutrina perderia justamente o texto completo. O
 *    estado é restaurado depois: quem fechou um bloco antes de imprimir não quer
 *    encontrá-lo aberto ao voltar.
 *
 * 2. **O destaque da navegação lateral.** Abrir ou fechar um bloco muda a altura
 *    do documento sem disparar `scroll` nem `resize`, e o ArtigoNavComponent só
 *    recalcula nesses dois eventos — o destaque ficaria apontando para a seção
 *    errada até a próxima rolagem. Um `resize` sintético o acorda.
 *
 * O listener de `toggle` é registrado na fase de captura porque `toggle` **não
 * borbulha**: sem `capture`, um listener no artigo nunca veria os `<details>`
 * filhos. É também o que evita ter de repetir um `(toggle)` em cada um dos
 * blocos das duas páginas.
 */
@Directive({ selector: '[amrBlocosRecolhiveis]' })
export class BlocosRecolhiveisDirective implements OnDestroy {
    private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly zone = inject(NgZone);

    /** Os que estavam fechados quando a impressão começou — e só esses. */
    private fechados: HTMLDetailsElement[] = [];

    constructor() {
        // Fora da zona: abrir um bloco não precisa arrastar um ciclo de detecção
        // junto, e o ArtigoNavComponent escuta o resize também fora dela.
        this.zone.runOutsideAngular(() => {
            this.host.nativeElement.addEventListener('toggle', this.aoAlternar, true);
        });
    }

    ngOnDestroy(): void {
        this.host.nativeElement.removeEventListener('toggle', this.aoAlternar, true);
    }

    private readonly aoAlternar = (): void => {
        window.dispatchEvent(new Event('resize'));
    };

    @HostListener('window:beforeprint')
    protected abrirParaImprimir(): void {
        this.fechados = Array.from(
            this.host.nativeElement.querySelectorAll<HTMLDetailsElement>('details:not([open])')
        );
        this.fechados.forEach(bloco => (bloco.open = true));
    }

    @HostListener('window:afterprint')
    protected restaurar(): void {
        this.fechados.forEach(bloco => (bloco.open = false));
        this.fechados = [];
    }
}
