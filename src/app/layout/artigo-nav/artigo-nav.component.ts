import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    NgZone,
    OnDestroy,
    inject,
    input,
    signal
} from '@angular/core';
import { AncoraDirective } from '../../shared/directives/ancora.directive';

export interface SecaoArtigo {
    /** id da <section> correspondente; entra na URL como fragment */
    fragment: string;
    /** rótulo curto — a calha tem ~190px, o título da seção não cabe inteiro */
    rotulo: string;
}

/**
 * Navegação lateral das páginas de leitura. Acima de 1200px ela fica fixa na
 * calha à esquerda do texto e acompanha a rolagem; abaixo disso vira um bloco
 * de índice acima do artigo (o mesmo DOM, só o grid do pai muda).
 *
 * O destaque da seção em leitura é por rolagem, e não por IntersectionObserver:
 * as seções destas páginas chegam a ser várias vezes mais altas que a janela, e
 * com elas um threshold de IO ou nunca dispara ou dispara em duas seções ao
 * mesmo tempo. Comparar o topo de cada seção com uma linha fixa é previsível em
 * qualquer altura de bloco.
 */
@Component({
    selector: 'app-artigo-nav',
    imports: [AncoraDirective],
    templateUrl: './artigo-nav.component.html',
    styleUrl: './artigo-nav.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtigoNavComponent implements AfterViewInit, OnDestroy {
    readonly secoes = input.required<readonly SecaoArtigo[]>();
    readonly titulo = input('Nesta página');

    protected readonly ativa = signal<string | null>(null);

    /** Altura, a partir do topo da janela, da linha que conta como "estou lendo aqui". */
    private static readonly LINHA_DE_LEITURA = 120;

    private readonly zone = inject(NgZone);
    private agendado = false;

    ngAfterViewInit(): void {
        // Fora da zona: rolagem dispara a cada quadro e não pode arrastar um
        // ciclo de detecção junto. A escrita no signal agenda o refresh sozinha.
        this.zone.runOutsideAngular(() => {
            window.addEventListener('scroll', this.aoRolar, { passive: true });
            window.addEventListener('resize', this.aoRolar, { passive: true });
        });
        this.recalcula();
    }

    ngOnDestroy(): void {
        window.removeEventListener('scroll', this.aoRolar);
        window.removeEventListener('resize', this.aoRolar);
    }

    private readonly aoRolar = (): void => {
        if (this.agendado) {
            return;
        }
        this.agendado = true;
        requestAnimationFrame(() => {
            this.agendado = false;
            this.recalcula();
        });
    };

    private recalcula(): void {
        const secoes = this.secoes();
        if (!secoes.length) {
            return;
        }

        let atual = secoes[0].fragment;
        for (const secao of secoes) {
            const el = document.getElementById(secao.fragment);
            if (el && el.getBoundingClientRect().top <= ArtigoNavComponent.LINHA_DE_LEITURA) {
                atual = secao.fragment;
            }
        }

        // No fim da página a última seção pode nunca cruzar a linha, se for
        // curta. Sem isto o destaque trava na penúltima.
        const fim = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
        if (fim) {
            atual = secoes[secoes.length - 1].fragment;
        }

        this.ativa.set(atual);
    }
}
