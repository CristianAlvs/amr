import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
    let canonical: HTMLLinkElement;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        canonical = document.createElement('link');
        canonical.id = 'canonical';
        canonical.rel = 'canonical';
        canonical.href = 'https://amensagemrevelada.com.br/';
        document.head.appendChild(canonical);
    });

    afterEach(() => canonical.remove());

    it('aplica title, description e canonical a partir do data da rota', () => {
        const service = TestBed.inject(SeoService);

        service.apply({
            title: 'Pontos doutrinários — A Mensagem Revelada',
            description: 'No que cremos.',
            canonical: '/pontos-doutrinarios'
        });

        expect(TestBed.inject(Title).getTitle()).toBe('Pontos doutrinários — A Mensagem Revelada');
        expect(canonical.getAttribute('href'))
            .toBe('https://amensagemrevelada.com.br/pontos-doutrinarios');
        expect(document.querySelector('meta[name="description"]')?.getAttribute('content'))
            .toBe('No que cremos.');
    });

    it('ignora campos ausentes em vez de apagar o que o index.html trouxe', () => {
        const service = TestBed.inject(SeoService);
        const antes = canonical.getAttribute('href');

        service.apply({ title: 'Só o título' });

        expect(canonical.getAttribute('href')).toBe(antes);
    });
});
