import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressureInfoComponent } from './pressure-info.component';

describe('PressureInfoComponent', () => {
  let component: PressureInfoComponent;
  let fixture: ComponentFixture<PressureInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PressureInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PressureInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
