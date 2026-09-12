import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ArtigoNavComponent, SecaoArtigo } from './artigo-nav.component';

describe('ArtigoNavComponent', () => {
  let component: ArtigoNavComponent;
  let fixture: ComponentFixture<ArtigoNavComponent>;
  let secoes: HTMLElement[];

  const SECOES: readonly SecaoArtigo[] = [
    { fragment: 'um',   rotulo: 'Primeira' },
    { fragment: 'dois', rotulo: 'Segunda' },
    { fragment: 'tres', rotulo: 'Terceira' }
  ];

  beforeEach(async () => {
    // As seções precisam existir no documento: o destaque é decidido pela
    // posição real de cada uma, não por dados.
    secoes = SECOES.map((s, i) => {
      const el = document.createElement('section');
      el.id = s.fragment;
      el.style.height = '600px';
      // A primeira já passou da linha de leitura; as outras ainda não.
      el.style.marginTop = i === 0 ? '0' : '2000px';
      document.body.appendChild(el);
      return el;
    });

    await TestBed.configureTestingModule({
      imports: [ArtigoNavComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ArtigoNavComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('secoes', SECOES);
    fixture.detectChanges();
  });

  afterEach(() => secoes.forEach(el => el.remove()));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lista uma entrada por seção, com o rótulo curto', () => {
    const rotulos = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.artigo-nav__link')
    ).map(a => a.textContent?.trim());
    expect(rotulos).toEqual(['Primeira', 'Segunda', 'Terceira']);
  });

  it('marca a seção em leitura com aria-current', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const marcados = el.querySelectorAll('.artigo-nav__link[aria-current="true"]');
    expect(marcados.length).toBe(1);
    expect(marcados[0].textContent?.trim()).toBe('Primeira');
  });

  it('solta os listeners de rolagem ao destruir', () => {
    const spy = spyOn(window, 'removeEventListener').and.callThrough();
    fixture.destroy();
    const eventos = spy.calls.allArgs().map(a => a[0]);
    expect(eventos).toContain('scroll');
    expect(eventos).toContain('resize');
  });
});
