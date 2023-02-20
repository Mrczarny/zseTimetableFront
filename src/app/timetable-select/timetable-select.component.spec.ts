import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableSelectComponent } from './timetable-select.component';

describe('TimetableSelectComponent', () => {
  let component: TimetableSelectComponent;
  let fixture: ComponentFixture<TimetableSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimetableSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetableSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
