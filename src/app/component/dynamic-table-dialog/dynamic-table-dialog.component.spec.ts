import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableDialogComponent } from './dynamic-table-dialog.component';

describe('DynamicTableDialogComponent', () => {
  let component: DynamicTableDialogComponent;
  let fixture: ComponentFixture<DynamicTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTableDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
