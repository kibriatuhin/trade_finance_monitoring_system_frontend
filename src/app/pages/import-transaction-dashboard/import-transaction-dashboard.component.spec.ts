import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTransactionDashboardComponent } from './import-transaction-dashboard.component';

describe('ImportTransactionDashboardComponent', () => {
  let component: ImportTransactionDashboardComponent;
  let fixture: ComponentFixture<ImportTransactionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTransactionDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportTransactionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
