import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalImportAmountComponent } from './total-import-amount.component';

describe('TotalImportAmountComponent', () => {
  let component: TotalImportAmountComponent;
  let fixture: ComponentFixture<TotalImportAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalImportAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalImportAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
