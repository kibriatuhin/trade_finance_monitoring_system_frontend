import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDashboardComponent } from './export-dashboard.component';

describe('ExportDashboardComponent', () => {
  let component: ExportDashboardComponent;
  let fixture: ComponentFixture<ExportDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
