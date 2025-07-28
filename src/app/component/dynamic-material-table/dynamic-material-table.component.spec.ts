import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicMaterialTableComponent } from './dynamic-material-table.component';

describe('DynamicMaterialTableComponent', () => {
  let component: DynamicMaterialTableComponent;
  let fixture: ComponentFixture<DynamicMaterialTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicMaterialTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicMaterialTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
