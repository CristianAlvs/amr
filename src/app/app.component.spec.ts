import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('deve ser criado', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renderiza o link de pular para o conteúdo como primeiro foco', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const skip = (fixture.nativeElement as HTMLElement).querySelector('.skip-link');
    expect(skip?.getAttribute('href')).toBe('#conteudo');
  });

  it('o alvo do skip-link existe e é focável por programa', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const alvo = (fixture.nativeElement as HTMLElement).querySelector('#conteudo');
    expect(alvo).toBeTruthy();
    expect(alvo?.getAttribute('tabindex')).toBe('-1');
  });

  it('renderiza a navegação uma única vez, dentro do hero', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('nav[aria-label="Navegação principal"]').length).toBe(1);
    expect(el.querySelector('.hero nav[aria-label="Navegação principal"]')).toBeTruthy();
  });

  it('limpa observer e timers pendentes ao destruir', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const observer = (app as unknown as { scrollObserver: IntersectionObserver }).scrollObserver;
    const spy = spyOn(observer, 'disconnect').and.callThrough();

    fixture.destroy();

    expect(spy).toHaveBeenCalled();
    expect((app as unknown as { timers: unknown[] }).timers.length).toBe(0);
  });
});
