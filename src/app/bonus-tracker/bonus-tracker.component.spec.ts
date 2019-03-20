import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusTrackerComponent } from './bonus-tracker.component';

describe('BonusTrackerComponent', () => {
  let component: BonusTrackerComponent;
  let fixture: ComponentFixture<BonusTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonusTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
