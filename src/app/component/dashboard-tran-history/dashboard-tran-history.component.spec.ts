import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTranHistoryComponent } from './dashboard-tran-history.component';

describe('DashboardTranHistoryComponent', () => {
  let component: DashboardTranHistoryComponent;
  let fixture: ComponentFixture<DashboardTranHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTranHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTranHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
