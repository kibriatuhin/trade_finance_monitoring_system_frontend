import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDetailsDialogComponent } from './table-details-dialog.component';

describe('TableDetailsDialogComponent', () => {
  let component: TableDetailsDialogComponent;
  let fixture: ComponentFixture<TableDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
