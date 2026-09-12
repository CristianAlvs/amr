import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PontosDoutrinariosComponent } from './pontos-doutrinarios.component';

describe('PontosDoutrinariosComponent', () => {
  let component: PontosDoutrinariosComponent;
  let fixture: ComponentFixture<PontosDoutrinariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PontosDoutrinariosComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PontosDoutrinariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('oferece o alvo do skip-link, que vive no shell', () => {
    const alvo = (fixture.nativeElement as HTMLElement).querySelector('#conteudo');
    expect(alvo).toBeTruthy();
    expect(alvo?.getAttribute('tabindex')).toBe('-1');
  });

  it('todo item da navegação aponta para uma seção da página', () => {
    const el = fixture.nativeElement as HTMLElement;
    const itens = Array.from(el.querySelectorAll<HTMLAnchorElement>('.artigo-nav__link'));
    expect(itens.length).toBe(4);

    for (const item of itens) {
      const fragment = item.getAttribute('href')?.split('#')[1];
      expect(el.querySelector(`section[id="${fragment}"]`))
        .withContext(`navegação aponta para #${fragment}`).toBeTruthy();
    }
  });

  it('renderiza os doze paralelos Jeová/Jesus, cada um com os dois lados', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(component.paralelos.length).toBe(12);
    expect(el.querySelectorAll('.artigo__par').length).toBe(12);

    for (const par of Array.from(el.querySelectorAll('.artigo__par'))) {
      expect(par.querySelectorAll('.artigo__par-lado').length).toBe(2);
    }
  });

  /* Sem referência, a citação vira texto solto e o leitor não consegue conferir. */
  it('todo versículo dos paralelos traz a sua referência', () => {
    for (const par of component.paralelos) {
      for (const versiculo of [...par.jeova, ...par.jesus]) {
        expect(versiculo.referencia.trim().length)
          .withContext(versiculo.texto.slice(0, 40)).toBeGreaterThan(0);
      }
    }
  });
});
