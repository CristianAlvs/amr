import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* O rodapé é a única navegação que sobrevive fora da home, então as duas
     páginas de leitura precisam estar aqui. */
  it('leva às duas páginas de leitura e às âncoras da home', () => {
    const hrefs = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.footer__link')
    ).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual([
      '/#hero',
      '/#sobre',
      '/william-branham',
      '/pontos-doutrinarios',
      '/#agenda',
      '/#contato'
    ]);
  });
});
