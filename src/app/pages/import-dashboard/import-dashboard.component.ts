import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
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
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-import-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DashboardTranHistoryComponent,
  ],
  templateUrl: './import-dashboard.component.html',
  styleUrl: './import-dashboard.component.css',
})
export class ImportDashboardComponent {
  totalPendingLc: string = '0';
  selectedYear: number = new Date().getFullYear();
  tempSelectedYear: number = 2024;
  selectCurrencyCode: string = '';
  showBranchCodeErrors: boolean = false;
  showCurrencyErrors: boolean = false;
  http = inject(HttpClient);
  years: number[] = [];
    // Currency map for symbols
  currencyMap = new Map([
    ['USD', '$'],
    ['EUR', '€'],
    ['BDT', '৳'],
    ['GBP', '£'],
    ['JPY', '¥'],
    ['INR', '₹'],
    ['CAD', 'CA$'],
    ['AUD', 'A$']
  ]);

  /** Reactive form group for managing export form inputs (year and currency). */
  importForm: FormGroup = new FormGroup({
    year: new FormControl(this.selectedYear, [Validators.required]),
    branchCode: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
    ]),
    currencyCode: new FormControl(this.selectCurrencyCode, [
      Validators.required,
      Validators.maxLength(3),
      Validators.pattern(/^[A-Za-z]+$/),
    ]),
  });
  /** Reference to the year select input field for initial focus. */
  @ViewChild('yearSelect') yearSelect!: ElementRef<HTMLInputElement>;

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
    importVatAmount: '0.0',
    importTaxAmount: '0.0',
    importPadAmt:'0.0',
    importBillAmt:'0.0'
  };

  constructor(
    private dashboardService: DashboardDataService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private router : Router
  ) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Check for Ctrl+R or F5
    if ((event.ctrlKey && event.key === 'r')) {
      event.preventDefault(); // Prevent default browser refresh
      this.refreshRoute();
    }
  }

  refreshRoute() {
     // Store current URL
  const currentUrl = this.router.url;
  
  // Navigate away and back (safer approach)
  this.router.navigate(['/']).then(() => {
    this.router.navigate([currentUrl]);
  });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.yearSelect?.nativeElement.focus();
    }, 0);
  }

  // Common keydown handler
  onKeyDownPress(
    event: KeyboardEvent,
    nextControl?: string,
    isLast: boolean = false
  ) {
    const key = event.key;
    const target = event.target as HTMLInputElement;

    if (key === 'Enter') {
      event.preventDefault();

      if (isLast) {
        this.onSubmit();
        return;
      }
      if (target?.getAttribute('formControlName') === 'branchCode') {
        this.showBranchCodeErrors = false;
        //this.markBranchCodeAsInvalid('');
      }

      if (nextControl) {
        this.focusField(nextControl);
      }
    }

    if (key === 'F2') {
      event.preventDefault();

      // Define your field navigation order
      const fieldOrder = ['year', 'branchCode', 'currencyCode'];
      const currentField = target?.getAttribute('formControlName');

      if (currentField) {
        const currentIndex = fieldOrder.indexOf(currentField);
        if (currentIndex > 0) {
          const previousField = fieldOrder[currentIndex - 1];
          this.focusField(previousField);
        }
      }
      return;
    }


    // === BRANCH CODE SPECIFIC: Block non-digit input ===
    if (target?.getAttribute('formControlName') === 'branchCode') {

      const controlKeys = [
        'Backspace', 'Tab', 'Delete', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
      ];
      if (controlKeys.includes(key)) {

      }

      else if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(key.toLowerCase())) {
        // Allow
      }

      else if (!/^[0-9]$/.test(key)) {
        event.preventDefault(); 
        this.markBranchCodeAsInvalid('pattern'); 
        this.showBranchCodeErrors = true; 
        return;
      } else {
        this.showBranchCodeErrors = false; 
        // this.markBranchCodeAsInvalid(''); // Clear any previous errors
      }
    }

    // Currency Code Press 
    if (target?.getAttribute('formControlName') === 'currencyCode') {
      const currentValue = target.value || '';

      const controlKeys = [
        'Backspace', 'Tab', 'Delete', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
      ];
      if (controlKeys.includes(key)) {

      }

      else if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(key.toLowerCase())) {
        // Allow
      }

    if (!controlKeys.includes(event.key) && !/^[A-Za-z]$/.test(event.key)) {
      event.preventDefault();
      this.markCurrencyAsInvalid('pattern');
      return;
    }
    
    // Prevent input if it would exceed 3 characters
    if (/^[A-Za-z]$/.test(event.key) && currentValue.length >= 3) {
      event.preventDefault();
      this.markCurrencyAsInvalid('maxlength');
      return;
    }
    }
  }

  // Focus helper method
  focusField(controlName: string) {
    const input: HTMLInputElement | null = this.el.nativeElement.querySelector(
      `[formControlName="${controlName}"]`
    );
    if (input) {
      input.focus();
    }
  }

  ngOnInit(): void {
    const startYear = 2015;
    const currentYear = new Date().getFullYear();
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }

    //this.loadDashboardData(); // initial load
  }

  onSubmit() {
    console.log('Form submitted press done ');
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService
      .fetchTotalImportSummary('/importDashboard/impHistory', {
        year: this.importForm.get('year')?.value|| '',
        branchCode: this.importForm.get('branchCode')?.value || '',
        currency: this.importForm.get('currencyCode')?.value || '',
      })
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
    this.yearSelect= this.importForm.get('year')?.value
    //this.loadDashboardData(); // reload data when selectedYear changes
  }

  toUppercase(event: Event) {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();
    input.value = upperValue;
    this.importForm.get('currencyCode')?.setValue(upperValue, { emitEvent: false });
    this.cdr.detectChanges(); // Ensure the view updates with the new value
  }

  openDialog() {
    const dialogRef = this.dialog.open(TotalImportAmountComponent, {
      width: '95vw', // viewport width 
      maxWidth: '1200px', // maximum width
      height: 'auto', // auto height
      maxHeight: '90vh', // maximum height
      //panelClass: 'custom-dialog-container', // custom styling 
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  private markBranchCodeAsInvalid(errorType: string) {
    const currencyControl = this.importForm.get('branchCode');
    if (currencyControl) {
      // Mark as dirty/touched to show validation
      currencyControl.markAsDirty();
      currencyControl.markAsTouched();

      // Set specific error
      if (errorType === 'pattern') {
        currencyControl.setErrors({ pattern: true });
      }
    }
  }

  get branchCodeErrorMessage(): string {
    //showBranchCodeErrors
    const control = this.importForm.get('branchCode');
    if (this.showBranchCodeErrors && control?.errors?.['pattern']) {
      return 'Branch code must contain only digits.';
    }

    // If field is empty and touched, show "For All Branch"
    if ((control?.dirty || control?.touched) && (!control.value || control.value.trim() === '')) {
      // Only show "For All Branch" if no invalid input was attempted
      if (!this.showBranchCodeErrors) {
        return 'For All Branch';
      }
      // If invalid input was attempted and field is now empty, show pattern error
      else if (control?.errors?.['pattern']) {
        return 'Branch code must contain only digits.';
      }
    }

    // Show other validation errors
    if ((control?.dirty || control?.touched) && control?.errors) {
      if (control.errors['pattern']) {
        return 'Branch code must contain only digits.';
      }
    }

    return '';
  }
  onBranchCodeBlur() {
    const control = this.importForm.get('branchCode');
    if (control) {
      // If field is empty after blur, clear any pattern errors
      if (!control.value || control.value.trim() === '') {
        control.markAsTouched();
        control.markAsDirty();
        // Clear pattern error if field is empty
        if (control.errors?.['pattern']) {
          control.setErrors(null);
        }
      }
    }
  }
  private markCurrencyAsInvalid(errorType: string) {
    const currencyControl = this.importForm.get('currencyCode');
    if (currencyControl) {
      // Mark as dirty/touched to show validation
      currencyControl.markAsDirty();
      currencyControl.markAsTouched();
      
      // Set specific error
      if (errorType === 'pattern') {
        currencyControl.setErrors({ pattern: true });
      } else if (errorType === 'maxlength') {
        currencyControl.setErrors({ maxlength: true });
      }
    }
  }

  /**
   * Getter for the currency error message based on current validation state.
   * @returns A user-friendly error message if validation fails.
   */
  get currencyErrorMessage(): string {
    const control = this.importForm.get('currencyCode');
    
    // Show errors if control is dirty/touched OR if manual validation is triggered
    if ((control?.dirty || control?.touched || this.showCurrencyErrors) && control?.errors) {
      if (control.errors['required']) {
        return 'Currency code is required.';
      }
      if (control.errors['maxlength']) {
        return 'Currency code must be 3 characters.';
      }
      if (control.errors['pattern']) {
        return 'Currency code must contain only letters.';
      }
    }
    return '';
  }


  getCurrencySymbol(): string {
    const currencyCode = this.importForm.get('currencyCode')?.value || this.selectCurrencyCode;
    return this.currencyMap.get(currencyCode?.toUpperCase()) || '$';
  }
}
