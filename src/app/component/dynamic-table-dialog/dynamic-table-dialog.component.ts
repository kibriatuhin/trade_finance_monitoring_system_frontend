import { Component, EventEmitter, Inject, Input, Optional, Output } from '@angular/core';
import { DynamicMaterialTableComponent } from '../../component/dynamic-material-table/dynamic-material-table.component';
import { MatDialogActions, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-table-dialog',
  standalone: true,
  imports: [DynamicMaterialTableComponent, MatDialogActions,MatDialogModule,CommonModule],
  templateUrl: './dynamic-table-dialog.component.html',
  styleUrl: './dynamic-table-dialog.component.css'
})
export class DynamicTableDialogComponent {
   @Input() data: any;
  @Output() onPage = new EventEmitter<any>();

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  ngOnInit() {
    // If used as dialog, use dialogData, otherwise use @Input() data
    if (this.dialogData && !this.data) {
      this.data = this.dialogData;
    }
  }

  onPageChangeHandler(event: any) {
    this.onPage.emit(event);
  }
}
