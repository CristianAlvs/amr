import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    // eyebrow e titulo são input.required — precisam vir antes do primeiro CD
    fixture.componentRef.setInput('eyebrow', 'No que cremos');
    fixture.componentRef.setInput('titulo', 'Pontos doutrinários');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('põe o título da página no h1', () => {
    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('Pontos doutrinários');
  });

  it('omite o subtítulo quando não é informado', () => {
    expect((fixture.nativeElement as HTMLElement).querySelector('.page-header__subtitle'))
      .toBeNull();
  });
});
