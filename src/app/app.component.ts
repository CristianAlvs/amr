import { AfterViewInit, Component, Injector, OnDestroy, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    ActivatedRoute,
    Event,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router,
    RouterOutlet
} from '@angular/router';
import { filter } from 'rxjs';
import { FooterComponent } from './layout/footer/footer.component';
import { ScrollRevealService } from './services/scroll-reveal.service';
import { SeoService } from './services/seo.service';
import { AncoraDirective } from './shared/directives/ancora.directive';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        FooterComponent,
        AncoraDirective,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly injector = inject(Injector);
    private readonly reveal = inject(ScrollRevealService);
    private readonly seo = inject(SeoService);

    private saltoTimer?: ReturnType<typeof setTimeout>;

    constructor() {
        this.router.events.pipe(
            filter((e): e is Event => e instanceof NavigationStart
                || e instanceof NavigationEnd
                || e instanceof NavigationCancel
                || e instanceof NavigationError),
            takeUntilDestroyed()
        ).subscribe(evento => {
            if (evento instanceof NavigationStart) {
                // Só troca de página salta. Ir para uma âncora (#agenda) continua
                // com a rolagem suave do reset.
                if (!evento.url.includes('#')) {
                    document.documentElement.classList.add('route-jump');
                }
                return;
            }

            // O scroll do router acontece depois do NavigationEnd; tirar a classe
            // no mesmo tick devolveria o smooth antes do salto.
            clearTimeout(this.saltoTimer);
            this.saltoTimer = setTimeout(
                () => document.documentElement.classList.remove('route-jump')
            );

            if (evento instanceof NavigationEnd) {
                this.seo.apply(this.rotaAtiva().snapshot.data);

                // O conteúdo da rota nova ainda não foi renderizado quando o
                // NavigationEnd chega — sem esperar o render, o scan varreria o
                // DOM da rota anterior e as seções nasceriam em opacity: 0.
                this.reveal.clearPending();
                afterNextRender(() => this.reveal.scan(), { injector: this.injector });
            }
        });
    }

    ngAfterViewInit(): void {
        this.reveal.scan();
    }

    ngOnDestroy(): void {
        clearTimeout(this.saltoTimer);
    }

    /** Desce até a rota folha, que é quem carrega o `data` de SEO. */
    private rotaAtiva(): ActivatedRoute {
        let rota = this.route;
        while (rota.firstChild) {
            rota = rota.firstChild;
        }
        return rota;
    }
}
