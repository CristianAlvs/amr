import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('o alvo do skip-link existe e é focável por programa', () => {
    const alvo = (fixture.nativeElement as HTMLElement).querySelector('#conteudo');
    expect(alvo).toBeTruthy();
    expect(alvo?.getAttribute('tabindex')).toBe('-1');
  });

  it('renderiza a navegação uma única vez, dentro do hero', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('nav[aria-label="Navegação principal"]').length).toBe(1);
    expect(el.querySelector('.hero nav[aria-label="Navegação principal"]')).toBeTruthy();
  });
});
