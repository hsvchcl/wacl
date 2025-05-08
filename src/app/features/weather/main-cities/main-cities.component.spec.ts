import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCitiesComponent } from './main-cities.component';

describe('MainCitiesComponent', () => {
  let component: MainCitiesComponent;
  let fixture: ComponentFixture<MainCitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
