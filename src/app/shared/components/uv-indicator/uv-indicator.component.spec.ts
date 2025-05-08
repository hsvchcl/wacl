import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UvIndicatorComponent } from './uv-indicator.component';

describe('UvIndicatorComponent', () => {
  let component: UvIndicatorComponent;
  let fixture: ComponentFixture<UvIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UvIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UvIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
