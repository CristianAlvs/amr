import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { AncoraDirective } from './ancora.directive';

@Component({
    imports: [AncoraDirective],
    template: `
        <a amrAncora="agenda" class="local">Agenda</a>
        <a amrAncora="fantasma" rota="/" class="remota">Não existe aqui</a>
        <section id="agenda" style="height: 50px">Agenda</section>
    `
})
class HospedeiroComponent {}

describe('AncoraDirective', () => {
    let fixture: ComponentFixture<HospedeiroComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HospedeiroComponent],
            providers: [provideRouter([])]
        }).compileComponents();

        fixture = TestBed.createComponent(HospedeiroComponent);
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    function link(seletor: string): HTMLAnchorElement {
        return (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>(seletor)!;
    }

    /**
     * Dispara o clique e devolve se a diretiva o cancelou.
     *
     * O guarda no documento não é zelo: os hrefs aqui são reais, e nos casos em
     * que a diretiva NÃO cancela (clique com modificador, clique do meio) o
     * Karma navegaria de verdade e recarregaria a página de testes no meio da
     * suíte. Ele lê o estado depois de a diretiva ter agido — está na fase de
     * bolha — e só então impede a navegação.
     */
    function clicar(seletor: string, init: MouseEventInit = { button: 0 }): boolean {
        let cancelado = false;
        const guarda = (e: Event): void => {
            cancelado = e.defaultPrevented;
            e.preventDefault();
        };

        document.addEventListener('click', guarda);
        link(seletor).dispatchEvent(
            new MouseEvent('click', { ...init, cancelable: true, bubbles: true })
        );
        document.removeEventListener('click', guarda);

        return cancelado;
    }

    /* O href precisa continuar real: é ele que faz o link abrir em nova aba,
       ser copiável e ser anunciado como link por leitor de tela. */
    it('mantém um href de verdade, no formato de sempre', () => {
        expect(link('.local').getAttribute('href')).toBe('/#agenda');
        expect(link('.remota').getAttribute('href')).toBe('/#fantasma');
    });

    /* Este é o teste que importa: foi exatamente isto que o usuário pediu. */
    it('não escreve nada na URL ao rolar até uma seção da própria página', () => {
        const urlAntes = router.url;
        const hashAntes = window.location.hash;

        clicar('.local');

        expect(router.url).toBe(urlAntes);
        expect(window.location.hash).toBe(hashAntes);
    });

    it('cancela o clique comum, para o navegador não pular pela âncora', () => {
        expect(clicar('.local')).toBeTrue();
    });

    /* Ctrl/Cmd/Shift + clique e clique do meio são pedidos de nova aba ou nova
       janela. Interceptá-los quebraria o link. */
    it('deixa passar o clique com modificador e o clique do meio', () => {
        for (const init of [
            { button: 0, ctrlKey: true },
            { button: 0, metaKey: true },
            { button: 0, shiftKey: true },
            { button: 1 }
        ]) {
            expect(clicar('.local', init))
                .withContext(JSON.stringify(init)).toBeFalse();
        }
    });

    /* Quando o alvo não está nesta página — o caso do rodapé numa página de
       leitura — a troca de rota é necessária, mas a URL para em '/' sem
       fragmento: quem rola é a diretiva, não o anchorScrolling. */
    it('navega para a rota indicada, e sem fragmento, quando o alvo não está na página', () => {
        const navegou = spyOn(router, 'navigateByUrl').and.resolveTo(true);

        clicar('.remota');

        expect(navegou).toHaveBeenCalledWith('/');
        expect(navegou.calls.mostRecent().args[0] as string).not.toContain('#');
    });

    /* Sem isto, quem navega por teclado aciona o link, a página rola e o foco
       continua onde estava — o Tab seguinte volta para o menu. */
    it('move o foco para a seção de destino', () => {
        clicar('.local');

        const alvo = (fixture.nativeElement as HTMLElement).querySelector('#agenda');
        expect(alvo?.getAttribute('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(alvo);
    });
});
