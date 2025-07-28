import { Component, EventEmitter, Output } from '@angular/core';
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
export class DynamicMaterialTableComponent  implements OnChanges, AfterViewInit {
  @Input() columns: { key: string; label: string; sortable?: boolean }[] = [];
  @Input() data: any[] = [];

   @Input() totalItems = 0;
  @Input() pageSize = 5;
  @Input() currentPage = 0;
  @Output() onPage = new EventEmitter<any>();

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(): void {
    this.displayedColumns = this.columns.map(c => c.key);
    this.dataSource.data = this.data;
  }

  ngAfterViewInit(): void {
    //this.dataSource.paginator = this.paginator;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onPageChange(event: PageEvent) {
    console.log(this.currentPage);
    console.log(this.pageSize)
    this.onPage.emit(event);
    // Emit to parent if needed
  }
  isDateColumn(key: string): boolean {
  return ['brnSignIn', 'brnSignOut'].includes(key);
}

}
