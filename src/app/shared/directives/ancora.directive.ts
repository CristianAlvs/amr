import {
    Directive,
    HostListener,
    Injector,
    afterNextRender,
    computed,
    inject,
    input
} from '@angular/core';
import { Router } from '@angular/router';

/**
 * Link para uma seção da página, **sem escrever nada na URL**.
 *
 * Antes isto era `[routerLink]="[]" fragment="sobre"`, e o efeito colateral era
 * pior do que parece: a barra virava `/#sobre` e o fragmento ficava congelado ali
 * enquanto o leitor rolava para outras seções — a URL passava a mentir sobre onde
 * ele estava. Pior ainda no índice lateral das páginas de leitura, onde cada
 * clique empilhava uma entrada no histórico e sair pelo botão Voltar exigia um
 * clique por seção visitada.
 *
 * O `href` continua real (`/#sobre`, `/william-branham#quem-e`): é o que mantém o
 * link abrível em nova aba, copiável e anunciado como link por leitor de tela.
 * Só o clique comum é interceptado.
 *
 * Um link colado na barra de endereços continua funcionando: o
 * `anchorScrolling` do router, em app.config.ts, é que cuida disso na carga
 * inicial. O site deixou de *escrever* fragmento, não de *ler* um.
 */
@Directive({
    selector: 'a[amrAncora]',
    host: { '[attr.href]': 'href()' }
})
export class AncoraDirective {
    /** id da `<section>` de destino. */
    readonly amrAncora = input.required<string>();

    /**
     * Rota onde esse id vive. `null` (o padrão) significa "a rota atual" e serve a
     * quem só existe dentro de uma página — navbar, hero, índice do artigo.
     * O rodapé é renderizado no shell, fora do `<router-outlet>`, e por isso tem
     * de dizer `rota="/"`: as seções que ele aponta moram na home.
     */
    readonly rota = input<string | null>(null);

    private readonly router = inject(Router);
    private readonly injector = inject(Injector);

    /**
     * `/#sobre`, `/william-branham#quem-e`. O caminho sai de `router.url` sem o
     * fragmento que por acaso estiver lá (um link colado, por exemplo), para o
     * href não acumular dois `#`.
     */
    protected readonly href = computed(
        () => `${this.rota() ?? this.router.url.split('#')[0]}#${this.amrAncora()}`
    );

    @HostListener('click', ['$event'])
    protected aoClicar(evento: MouseEvent): void {
        // Clique do meio, do direito, ou com modificador: é pedido de nova aba /
        // nova janela / salvar. Devolve ao navegador sem tocar em nada.
        if (evento.button !== 0
            || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) {
            return;
        }

        evento.preventDefault();

        const alvo = document.getElementById(this.amrAncora());
        if (alvo) {
            this.rolaAte(alvo);
            return;
        }

        // O alvo não está nesta página: é o caso do rodapé numa página de leitura.
        // Aí a troca de rota é necessária e a URL muda — mas para `/` limpa, sem
        // fragmento, porque quem rola somos nós e não o anchorScrolling.
        void this.router.navigateByUrl(this.rota() ?? '/').then(() => {
            afterNextRender(
                () => {
                    const destino = document.getElementById(this.amrAncora());
                    // 'auto' explícito: é troca de página, o certo é aparecer já no
                    // lugar. Também evita corrida com a classe .route-jump, que o
                    // AppComponent remove num setTimeout(0) e que justamente
                    // desliga o scroll suave durante a navegação.
                    destino?.scrollIntoView({ block: 'start', behavior: 'auto' });
                    this.focaSemRolar(destino);
                },
                { injector: this.injector }
            );
        });
    }

    private rolaAte(alvo: HTMLElement): void {
        // Sem `behavior`: assim vale o `scroll-behavior: smooth` do _reset.scss e,
        // junto com ele, o bloco de prefers-reduced-motion que o zera. Passar
        // 'smooth' na mão atropelaria essa preferência.
        alvo.scrollIntoView({ block: 'start' });
        this.focaSemRolar(alvo);
    }

    /**
     * Sem isto, quem navega por teclado aciona "Contato", a página rola e o foco
     * continua na navbar — o Tab seguinte volta para o menu em vez de entrar na
     * seção. Não é regressão desta mudança; é uma falha que já existia com o
     * routerLink e que fica barata de corrigir aqui.
     */
    private focaSemRolar(alvo: HTMLElement | null): void {
        if (!alvo) {
            return;
        }
        if (!alvo.hasAttribute('tabindex')) {
            alvo.setAttribute('tabindex', '-1');
        }
        alvo.focus({ preventScroll: true });
    }
}
