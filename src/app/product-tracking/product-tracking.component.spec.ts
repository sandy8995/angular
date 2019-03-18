import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTrackingComponent } from './product-tracking.component';

describe('ProductTrackingComponent', () => {
  let component: ProductTrackingComponent;
  let fixture: ComponentFixture<ProductTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
