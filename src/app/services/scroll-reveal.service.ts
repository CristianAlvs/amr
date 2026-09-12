import { Injectable, OnDestroy } from '@angular/core';

/**
 * Revela os elementos `.animate-on-scroll` quando eles entram na viewport.
 *
 * Antes isto vivia direto no AppComponent e varria o documento uma única vez,
 * no ngAfterViewInit. Com rotas isso não serve mais: o conteúdo de uma
 * subpágina nasce depois dessa varredura e, como `.animate-on-scroll` nasce
 * `opacity: 0`, ficaria invisível para sempre. Daí `scan()` ser público e
 * reexecutável a cada navegação.
 *
 * `.animate-fade-up` não passa por aqui — aquele anima sozinho na carga, via
 * animation-delay em CSS.
 */
@Injectable({ providedIn: 'root' })
export class ScrollRevealService implements OnDestroy {
    private observer?: IntersectionObserver;
    private timers: ReturnType<typeof setTimeout>[] = [];

    /**
     * Observa todo `.animate-on-scroll` ainda não revelado. É idempotente: a
     * spec do IntersectionObserver trata observe() de um alvo já observado como
     * no-op, então chamar a cada navegação não acumula nada.
     */
    scan(): void {
        this.observer ??= new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    const el = entry.target as HTMLElement;
                    const delay = Number(el.dataset['delay']) || 0;
                    if (delay > 0) {
                        this.timers.push(setTimeout(() => el.classList.add('visible'), delay));
                    } else {
                        el.classList.add('visible');
                    }
                    this.observer?.unobserve(el);
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.animate-on-scroll:not(.visible)')
            .forEach(el => this.observer!.observe(el));
    }

    /**
     * Cancela os timers de `data-delay` pendentes. Na troca de rota o elemento
     * que o timer ia revelar já saiu do DOM.
     */
    clearPending(): void {
        this.timers.forEach(clearTimeout);
        this.timers = [];
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        this.clearPending();
    }
}
