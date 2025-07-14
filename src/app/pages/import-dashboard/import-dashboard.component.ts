import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { DashboardDataService } from '../../services/dashboard/dashboard-data.service';

import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TotalImportAmountComponent } from '../../dialogs/total-import-amount/total-import-amount.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-import-dashboard',
  standalone: true,
  imports: [MatCardModule,MatSelectModule,CommonModule],
  templateUrl: './import-dashboard.component.html',
  styleUrl: './import-dashboard.component.css'
})
export class ImportDashboardComponent {
  totalLcAmount: string = '0.00';
  totalLcOsAmount: string = '0.00';
  totalLcCommAmount: string = '0.00';
  totalLcSwftAmount: string = '0.00';
  selectedYear: number = new Date().getFullYear();
  http = inject(HttpClient);
   years: number[] = [];

 constructor(private dashboardService: DashboardDataService,private dialog: MatDialog) {}

 loadDashboardData(): void {
  this.dashboardService.fetchFormattedAmount(
    'http://localhost:9092/api/v1/importDashboard/totalImportAmount',
    { year: this.selectedYear.toString() }
  ).subscribe(value => {
    if (value === '0') {
      value = '0.00'; // Fallback to '0.00' if the API returns 'N/A'
    }
    // Fallback to '0.00' if the
    this.totalLcAmount = value

  });

  this.dashboardService.fetchFormattedAmount(
    'http://localhost:9092/api/v1/importDashboard/totalImportOsLiab',
    { year: this.selectedYear.toString() }
  ).subscribe(value => {
    if (value === '0') {
      value = '0.00'; // Fallback to '0.00' if the API returns 'N/A'
    }
    this.totalLcOsAmount = value});

  this.dashboardService.fetchFormattedAmount(
    'http://localhost:9092/api/v1/importDashboard/totalImportSwftAmount',
    { year: this.selectedYear.toString() }
  ).subscribe(value => 
    this.totalLcSwftAmount = value 
  );

  this.dashboardService.fetchFormattedAmount(
    'http://localhost:9092/api/v1/importDashboard/totalImportCommAmount',
    { year: this.selectedYear.toString() }
  ).subscribe(value => 
    
    this.totalLcCommAmount = value);
}
onYearChange(): void {
  this.loadDashboardData(); // reload data when selectedYear changes
}


ngOnInit(): void {
  const startYear = 2015;
  const currentYear = new Date().getFullYear();
  for (let year = startYear; year <= currentYear; year++) {
    this.years.push(year);
  }

  this.loadDashboardData(); // initial load
}


 openDialog() {
    const dialogRef = this.dialog.open(TotalImportAmountComponent, {
        width: '95vw',        // viewport width এর 95%
        maxWidth: '1200px',   // maximum width
        height: 'auto',       // auto height
        maxHeight: '90vh',    // maximum height
        panelClass: 'large-dialog' // custom styling এর জন্য
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
    });
}


}
