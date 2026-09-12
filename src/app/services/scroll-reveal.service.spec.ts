import { TestBed } from '@angular/core/testing';
import { ScrollRevealService } from './scroll-reveal.service';

describe('ScrollRevealService', () => {
    let alvo: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        alvo = document.createElement('div');
        alvo.className = 'animate-on-scroll';
        document.body.appendChild(alvo);
    });

    afterEach(() => alvo.remove());

    it('deve ser criado', () => {
        expect(TestBed.inject(ScrollRevealService)).toBeTruthy();
    });

    /* É o que sustenta a re-varredura a cada NavigationEnd: chamar de novo não
       pode explodir nem duplicar observação. */
    it('scan é idempotente', () => {
        const service = TestBed.inject(ScrollRevealService);
        expect(() => { service.scan(); service.scan(); }).not.toThrow();
    });

    it('desconecta o observer e limpa os timers ao destruir', () => {
        const service = TestBed.inject(ScrollRevealService);
        service.scan();

        const observer = (service as unknown as { observer: IntersectionObserver }).observer;
        expect(observer).toBeTruthy();
        const spy = spyOn(observer, 'disconnect').and.callThrough();

        service.ngOnDestroy();

        expect(spy).toHaveBeenCalled();
        expect((service as unknown as { timers: unknown[] }).timers.length).toBe(0);
    });
});
