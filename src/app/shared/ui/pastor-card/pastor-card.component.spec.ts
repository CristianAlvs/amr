import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastorCardComponent } from './pastor-card.component';

describe('PastorCardComponent', () => {
  let component: PastorCardComponent;
  let fixture: ComponentFixture<PastorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastorCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
