import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportTransactionDashboardComponent } from './export-transaction-dashboard.component';

describe('ExportTransactionDashboardComponent', () => {
  let component: ExportTransactionDashboardComponent;
  let fixture: ComponentFixture<ExportTransactionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportTransactionDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportTransactionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
