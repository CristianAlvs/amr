import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

/* O AppComponent virou shell: skip-link, <router-outlet> e rodapé. O que era
   testado aqui sobre o conteúdo da home (o alvo #conteudo e a navegação dentro
   do hero) mudou para home.component.spec.ts, que monta a home diretamente; e o
   teste de limpeza do observer foi para scroll-reveal.service.spec.ts, que
   agora é o dono dele. */
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('deve ser criado', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  /* O href ganhou a barra da raiz quando o skip-link passou a usar a
     AncoraDirective, que resolve o caminho da rota atual — antes era a âncora
     crua '#conteudo'. O clique não navega mais: a diretiva rola e move o foco
     sem tocar na URL. */
  it('renderiza o link de pular para o conteúdo como primeiro foco', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const skip = (fixture.nativeElement as HTMLElement).querySelector('.skip-link');
    expect(skip?.getAttribute('href')).toBe('/#conteudo');
  });

  it('renderiza o rodapé fora do outlet, para valer em todas as rotas', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('main router-outlet')).toBeTruthy();
    expect(el.querySelector('main .footer')).toBeNull();
    expect(el.querySelector('.footer')).toBeTruthy();
  });
});
