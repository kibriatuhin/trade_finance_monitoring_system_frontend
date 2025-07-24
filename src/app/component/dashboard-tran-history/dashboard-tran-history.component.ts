import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DashboardDataService } from '../../services/dashboard/dashboard-data.service';
import { TranHistory } from '../../shared/model/TranHistory';

@Component({
  selector: 'app-dashboard-tran-history',
  standalone: true,
  imports: [CommonModule,
      FormsModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatTableModule,
      MatIconModule,MatPaginatorModule,MatSortModule],
  templateUrl: './dashboard-tran-history.component.html',
  styleUrl: './dashboard-tran-history.component.css'
})
export class DashboardTranHistoryComponent {
displayedColumns: string[] = [
    'rn', 'brnCode', 'postTranBatchNum', 'custNum',
    'importType', 'lcCurrCode', 'lcAmount', 'authBy', 'authOn', 'entdOn'
  ];
  dataSource = new MatTableDataSource<TranHistory>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dashboardService: DashboardDataService) {}

  ngOnInit() {
    this.fetchData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchData(): void {
    this.dashboardService.fetchTranHistory(2024).subscribe(data => {
    this.dataSource.data = data;
  });
  }

  onFilterKeyup(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    this.applyFilter(input.value);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}



