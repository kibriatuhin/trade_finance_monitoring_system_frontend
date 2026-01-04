import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



export type DetailField = { label: string; value: any };
@Component({
  selector: 'app-table-details-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-details-dialog.component.html',
  styleUrl: './table-details-dialog.component.css'
})
export class TableDetailsDialogComponent {
  
  /*constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title?: string; fields: DetailField[] }
  ) {}

  
  get fieldPairs(): DetailField[][] {
    const pairs: DetailField[][] = [];
    for (let i = 0; i < (this.data?.fields?.length || 0); i += 2) {
      pairs.push(this.data.fields.slice(i, i + 2));
    }
    return pairs;
  }*/
  constructor(
    private dialogRef: MatDialogRef<TableDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title?: string; fields: DetailField[] }
  ) {}

  close() {
    this.dialogRef.close(true);
  }

  get fieldPairs(): DetailField[][] {
    const fields = this.data?.fields ?? [];
    const pairs: DetailField[][] = [];
    for (let i = 0; i < fields.length; i += 2) {
      pairs.push(fields.slice(i, i + 2));
    }
    return pairs;
  }

  trackPair = (_: number, pair: DetailField[]) => pair?.[0]?.label ?? _;
}
