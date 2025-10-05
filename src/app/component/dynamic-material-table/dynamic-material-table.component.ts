import { Component, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-material-table',
  standalone: true,
  imports: [MatTableModule,MatPaginatorModule, MatSortModule,MatSort,CommonModule ],
  templateUrl: './dynamic-material-table.component.html',
  styleUrl: './dynamic-material-table.component.css'
})
export class DynamicMaterialTableComponent  implements OnChanges {
  @Input() columns: { key: string; label: string; sortable?: boolean; cssClass?: string; width?: string; minWidth?: string; }[] = [];
  @Input() data: any[] = [];

   @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 0;
  @Output() onPage = new EventEmitter<any>();

  displayedColumns: string[] = [];
 // dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    this.displayedColumns = this.columns.map(c => c.key);

    // 🔥 Critical: Manually update paginator's length & index
     if (changes['currentPage'] || changes['pageSize'] || changes['totalItems']) {
    // Re-initialize paginator or update its state
    this.paginator.pageIndex = this.currentPage;
    this.paginator.pageSize = this.pageSize;
    this.paginator.length = this.totalItems;
  }
  }

  

  onPageChange(event: PageEvent) {
    console.log(this.currentPage);
    console.log(this.pageSize);
    this.onPage.emit(event);
    // Emit to parent if needed
  }

}
