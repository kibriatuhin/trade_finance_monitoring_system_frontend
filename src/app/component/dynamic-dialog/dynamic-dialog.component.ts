import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export interface DialogColumn {
  header: string;
  field: string;
  width?: string;
}

@Component({
  selector: 'app-dynamic-dialog',
  standalone: true,
  imports: [MatPaginator,CommonModule,MatPaginatorModule,MatTableModule],
  templateUrl: './dynamic-dialog.component.html',
  styleUrl: './dynamic-dialog.component.css'
})
export class DynamicDialogComponent {
   @Input() show = false;
  @Input() title = 'Select Item';
  @Input() columns: DialogColumn[] = [];
  @Input() set data(value: any[]) {
    this.dataSource.data = value || [];
  }



  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<any>();


  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];

  hoveredIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren('rowEl') rowEls!: QueryList<ElementRef<HTMLTableRowElement>>;

  ngOnInit() {
    this.displayedColumns = this.columns.map(c => c.field);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onCancel() {
    this.close.emit();
    this.hoveredIndex = 0;
  }

  onSelect(row: any) {
    this.select.emit(row);
    this.hoveredIndex = 0;
  }
}
