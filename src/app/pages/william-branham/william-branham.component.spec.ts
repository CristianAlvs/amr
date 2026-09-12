import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { WilliamBranhamComponent } from './william-branham.component';

describe('WilliamBranhamComponent', () => {
  let component: WilliamBranhamComponent;
  let fixture: ComponentFixture<WilliamBranhamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WilliamBranhamComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WilliamBranhamComponent);
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

  /* Cada item do índice tem de apontar para uma seção existente — um fragment
     órfão não dá erro, só não rola. */
  it('todo item do índice aponta para uma seção da página', () => {
    const el = fixture.nativeElement as HTMLElement;
    const itens = Array.from(el.querySelectorAll<HTMLAnchorElement>('.artigo__indice a'));
    expect(itens.length).toBe(8);

    for (const item of itens) {
      const fragment = item.getAttribute('href')?.split('#')[1];
      expect(el.querySelector(`section[id="${fragment}"]`))
        .withContext(`índice aponta para #${fragment}`).toBeTruthy();
    }
  });
});
