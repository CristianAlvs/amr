import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CultoCardComponent } from './culto-card.component';

describe('CultoCardComponent', () => {
  let component: CultoCardComponent;
  let fixture: ComponentFixture<CultoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CultoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CultoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
