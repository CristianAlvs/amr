import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
    selector: 'app-root',
    imports: [
        HomeComponent,
        FooterComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
    private scrollObserver!: IntersectionObserver;
    private timers: ReturnType<typeof setTimeout>[] = [];

    ngAfterViewInit(): void {
        // .animate-fade-up anima sozinho na carga, via animation-delay em CSS.
        // Aqui só tratamos o que depende de entrar na viewport.
        this.scrollObserver = new IntersectionObserver(
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
                    this.scrollObserver.unobserve(el);
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.animate-on-scroll')
            .forEach(el => this.scrollObserver.observe(el));
    }

    ngOnDestroy(): void {
        this.scrollObserver?.disconnect();
        this.timers.forEach(clearTimeout);
        this.timers = [];
    }
}
