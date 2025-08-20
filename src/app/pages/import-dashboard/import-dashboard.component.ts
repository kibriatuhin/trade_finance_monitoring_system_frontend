import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardDataService } from '../../services/dashboard/dashboard-data.service';

import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TotalImportAmountComponent } from '../../dialogs/total-import-amount/total-import-amount.component';
import { CommonModule } from '@angular/common';
import { DashboardTranHistoryComponent } from '../../component/dashboard-tran-history/dashboard-tran-history.component';
import { ImportSummaryData } from '../../shared/interface/ImportSummaryData';

@Component({
  selector: 'app-import-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatSelectModule,
    CommonModule,
    DashboardTranHistoryComponent,
  ],
  templateUrl: './import-dashboard.component.html',
  styleUrl: './import-dashboard.component.css',
})
export class ImportDashboardComponent {
  totalPendingLc: string = '0';

  selectedYear: number = new Date().getFullYear();
  http = inject(HttpClient);
  years: number[] = [];
  totalImportLcSummary: ImportSummaryData = {
    importPadOs: '0.0',
    ImportOsLiab: '0.0',
    impAccChgAmount: '0.0',
    impPendingLc: '0',
    impPayChgAmount: '0.0',
    impCommAmount: '0.0',
    importPayment: '0.0',
    impSwftChgAmount: '0.0',
    importAmount: '0.0',
    importLcOpen: '0',
  };

  constructor(
    private dashboardService: DashboardDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const startYear = 2015;
    const currentYear = new Date().getFullYear();
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }

    this.loadDashboardData(); // initial load
  }

  loadDashboardData(): void {
    this.dashboardService
      .fetchTotalImportSummary(
        '/importDashboard/impHistory',
        { year: this.selectedYear.toString() }
      )
      .subscribe({
        next: (data) => {
          console.log('Total Import LC Summary:', data);
          this.totalImportLcSummary = data;
        },
        error: (err) => {
          console.error('Failed to fetch import summary:', err);
        },
      });
  }
  onYearChange(): void {
    this.loadDashboardData(); // reload data when selectedYear changes
  }

  openDialog() {
    const dialogRef = this.dialog.open(TotalImportAmountComponent, {
      width: '95vw', // viewport width এর 95%
      maxWidth: '1200px', // maximum width
      height: 'auto', // auto height
      maxHeight: '90vh', // maximum height
      panelClass: 'large-dialog', // custom styling এর জন্য
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
