import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaLiveComponent } from './cta-live.component';

describe('CtaLiveComponent', () => {
  let component: CtaLiveComponent;
  let fixture: ComponentFixture<CtaLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaLiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtaLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
