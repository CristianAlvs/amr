import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* Os hrefs ganharam a barra da raiz quando os links viraram routerLink +
     fragment — antes eram âncoras puras ('#sobre'). */
  it('lista as três seções na ordem da página', () => {
    const hrefs = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.nav__link')
    ).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['/#sobre', '/#agenda', '/#contato']);
  });
});
