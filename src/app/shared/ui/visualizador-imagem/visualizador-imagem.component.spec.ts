import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizadorImagemComponent } from './visualizador-imagem.component';

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

@Component({
    imports: [VisualizadorImagemComponent],
    template: `
        <article #artigo>
            <figure class="artigo__figura">
                <img class="foto" src="${PIXEL}#p"
                     srcset="${PIXEL}#p 480w, ${PIXEL}#g 1600w, ${PIXEL}#m 960w"
                     alt="Uma foto">
                <figcaption> A legenda da foto. </figcaption>
            </figure>
            <img class="fora" src="${PIXEL}" alt="Fora de figura">
        </article>
        <app-visualizador-imagem [em]="artigo" />
    `
})
class HospedeiroComponent {}

describe('VisualizadorImagemComponent', () => {
    let fixture: ComponentFixture<HospedeiroComponent>;
    let raiz: HTMLElement;

    const dialogo = () => raiz.querySelector<HTMLDialogElement>('dialog.visualizador')!;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [HospedeiroComponent] }).compileComponents();
        fixture = TestBed.createComponent(HospedeiroComponent);
        raiz = fixture.nativeElement;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    afterEach(() => dialogo().open && dialogo().close());

    it('torna as fotos do artigo focáveis e rotuladas', () => {
        const foto = raiz.querySelector<HTMLImageElement>('.foto')!;
        expect(foto.tabIndex).toBe(0);
        expect(foto.getAttribute('role')).toBe('button');
        expect(foto.getAttribute('aria-label')).toBe('Ampliar imagem: Uma foto');
        expect(raiz.querySelector('.fora')!.hasAttribute('role')).toBeFalse();
    });

    it('abre no clique com a maior versão do srcset e a legenda', () => {
        raiz.querySelector<HTMLImageElement>('.foto')!.click();
        fixture.detectChanges();

        expect(dialogo().open).toBeTrue();
        expect(raiz.querySelector<HTMLImageElement>('.visualizador__foto')!.getAttribute('src'))
            .toBe(`${PIXEL}#g`);
        expect(raiz.querySelector('.visualizador__legenda')!.textContent!.trim())
            .toBe('A legenda da foto.');
    });

    it('abre com Enter e fecha pelo botão', () => {
        raiz.querySelector('.foto')!.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
        );
        fixture.detectChanges();
        expect(dialogo().open).toBeTrue();

        raiz.querySelector<HTMLButtonElement>('.visualizador__fechar')!.click();
        expect(dialogo().open).toBeFalse();
    });

    it('ignora imagens fora de .artigo__figura', () => {
        raiz.querySelector<HTMLImageElement>('.fora')!.click();
        expect(dialogo().open).toBeFalse();
    });
});
