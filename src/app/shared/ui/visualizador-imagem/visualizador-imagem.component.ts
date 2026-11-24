import {
    Component,
    DestroyRef,
    ElementRef,
    afterNextRender,
    inject,
    input,
    signal,
    viewChild
} from '@angular/core';

interface ImagemAberta {
    src: string;
    alt: string;
    legenda: string;
}

/** As fotos do corpo do artigo. Ícones, logo e o que mais vier ficam de fora. */
const SELETOR = '.artigo__figura img';

/**
 * Abre as fotos de uma página de leitura em tela cheia, inteiras e na maior
 * resolução publicada. Na página elas aparecem pequenas (a marginalia tem
 * ~190px) ou recortadas pela coluna, e a legenda sozinha não basta para ver uma
 * fotografia histórica.
 *
 * Vai uma vez por página, depois do `<article>`, recebendo-o em `em`:
 *
 *     <article #artigo …>…</article>
 *     <app-visualizador-imagem [em]="artigo" />
 *
 * Um listener só, delegado no artigo, em vez de um `(click)` em cada figura: as
 * figuras continuam sendo HTML puro e uma foto nova já nasce ampliável.
 *
 * O `<dialog>` nativo com `showModal()` resolve o que um overlay feito à mão
 * teria de reimplementar: fica na top layer acima de tudo, prende o foco, fecha
 * no Esc e devolve o foco à foto que o abriu.
 */
@Component({
    selector: 'app-visualizador-imagem',
    templateUrl: './visualizador-imagem.component.html',
    styleUrl: './visualizador-imagem.component.scss'
})
export class VisualizadorImagemComponent {
    readonly em = input.required<HTMLElement>();

    private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');

    protected readonly imagem = signal<ImagemAberta | null>(null);

    constructor() {
        afterNextRender(() => {
            const artigo = this.em();
            this.prepararFotos(artigo);
            artigo.addEventListener('click', this.aoClicar);
            artigo.addEventListener('keydown', this.aoTeclar);
        });

        inject(DestroyRef).onDestroy(() => {
            const artigo = this.em();
            artigo.removeEventListener('click', this.aoClicar);
            artigo.removeEventListener('keydown', this.aoTeclar);
        });
    }

    protected fechar(): void {
        this.dialogo().nativeElement.close();
    }

    /** O dialog ocupa a tela toda: clique que cai nele, e não na foto, é no fundo. */
    protected aoClicarNoFundo(evento: MouseEvent): void {
        if (evento.target === evento.currentTarget) {
            this.fechar();
        }
    }

    /**
     * Uma `<img>` não recebe foco nem responde a Enter. Sem isto a ampliação
     * seria só de mouse. O `role="button"` troca a semântica de imagem pela de
     * controle, então o `alt` vai junto no rótulo para não se perder.
     */
    private prepararFotos(artigo: HTMLElement): void {
        artigo.querySelectorAll<HTMLImageElement>(SELETOR).forEach(foto => {
            foto.tabIndex = 0;
            foto.setAttribute('role', 'button');
            foto.setAttribute('aria-haspopup', 'dialog');
            foto.setAttribute('aria-label', `Ampliar imagem: ${foto.alt}`);
        });
    }

    private readonly aoClicar = (evento: MouseEvent): void => {
        const foto = (evento.target as Element).closest<HTMLImageElement>(SELETOR);
        if (foto) {
            this.abrir(foto);
        }
    };

    private readonly aoTeclar = (evento: KeyboardEvent): void => {
        if (evento.key !== 'Enter' && evento.key !== ' ') {
            return;
        }
        const foto = (evento.target as Element).closest<HTMLImageElement>(SELETOR);
        if (foto) {
            // Espaço rolaria a página por baixo do dialog
            evento.preventDefault();
            this.abrir(foto);
        }
    };

    private abrir(foto: HTMLImageElement): void {
        this.imagem.set({
            src: maiorVersao(foto),
            alt: foto.alt,
            legenda: foto.closest('figure')?.querySelector('figcaption')?.textContent?.trim() ?? ''
        });
        this.dialogo().nativeElement.showModal();
    }
}

/**
 * A maior largura do `srcset`. O `currentSrc` não serve: é a versão escolhida
 * para o tamanho da figura na página, que é justamente a pequena.
 */
function maiorVersao(foto: HTMLImageElement): string {
    // Pares "url 1600w". Não dá para quebrar por vírgula: uma URL pode conter uma.
    const candidatas = [...foto.srcset.matchAll(/(\S+)\s+(\d+)w/g)]
        .map(([, url, largura]) => ({ url: url.replace(/^,+/, ''), largura: Number(largura) }))
        .sort((a, b) => b.largura - a.largura);

    return candidatas[0]?.url ?? foto.currentSrc ?? foto.src;
}
