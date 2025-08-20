import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormsModule, NgSelectOption } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewChild, AfterViewInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { ShowDialogComponent } from '../../component/show-dialog/show-dialog.component';
import { ExportSummaryData } from '../../shared/interface/ExportSummaryData';
import { ExportDashServiceService } from '../../services/export-dashboard/export-dash-service.service';
import { Currency } from '../../shared/interface/Currency';

@Component({
  selector: 'app-export-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    MatIcon,
    ReactiveFormsModule,
    ShowDialogComponent,
  ],
  templateUrl: './export-dashboard.component.html',
  styleUrl: './export-dashboard.component.css',
})
export class ExportDashboardComponent implements AfterViewInit {
  selectCurrencyCode = '';
  showCurrencyErrors = false;
  showPopover = false;
  years: number[] = [];
  selectedYear: number = new Date().getFullYear();
  totalExportSummary: ExportSummaryData = {
           totalExportOpen: '0',
          totalOrderOpen: '0',
          totalExportAmount: '0.0',
          totalOrderAmount: '0.0',
          totalBtbAmount: '0.0',
          totalBtbOpen: '0.0',
          totalExpPcAmount: '0.0',
          totalExpBillAmount: '0.0',
          totalExpPlAmount: '0.0',
          totalExpPcOpen: '0',
          totalExpBillOpen: '0',
          totalExpPlOpen: '0',
          totalExpBtbBillOpen: '0',
          totalExpBtbBillAmount: '0.0',
          totalExpBtbPayAmount: '0.0',
          totalExpDispAmount: '0.0',
          totalExpEdfRecvdAmount: '0.0',
          totalExpEdfRefundAmount: '0.0'
        };

  /** Reference to the wrapper element used for detecting outside clicks. */
  @ViewChild('wrapper', { static: true }) wrapper!: ElementRef<HTMLElement>;

  /** Reference to the year select input field for initial focus. */
  @ViewChild('yearSelect') yearSelect!: ElementRef<HTMLInputElement>;

  /** List of supported currencies with their codes and names. */
  currenciess = [
    { code: 'AUD', name: 'AUSTRALIAN DOLLAR' },
    { code: 'USD', name: 'U.S. DOLLAR' },
    { code: 'AED', name: 'UAE DIRHAM' },
    { code: 'LKR', name: 'Sri Lankan Rupee' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'SGD', name: 'SINGAPORE DOLLAR' },
    { code: 'GBP', name: 'G.B. POUND' },
  ];
  currencies: Currency[] = [];
 



  /** Reactive form group for managing export form inputs (year and currency). */
  exportForm: FormGroup = new FormGroup({
    year: new FormControl(this.selectedYear, [Validators.required]),
    currency: new FormControl(this.selectCurrencyCode, [
      Validators.required,
      Validators.maxLength(3),
      Validators.pattern(/^[A-Za-z]+$/),
    ]),
  });

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef,private exportDashboardService: ExportDashServiceService) {}

  /**
   * Lifecycle hook that initializes the list of available years.
   * Populates the `years` array from 2015 up to the current year.
   */
  ngOnInit(): void {
    const startYear = 2015;
    const currentYear = new Date().getFullYear();
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
   this.exportDashboardService.getCurrencies("/modal/currency").subscribe({
      next: (data: Currency[]) => {
        this.currencies = data;
       // console.log(this.currencies); // This will show your desired format
      },
      error: (error) => {
        console.error('Error fetching currencies:', error);
      }
    });
  }

  /**
   * Lifecycle hook called after the view has been initialized.
   * Sets focus on the year select input element after a short delay.
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this.yearSelect?.nativeElement.focus();
    }, 0);
  }

  /**
   * Converts the input value to uppercase and updates the currency form control.
   * Ensures the UI reflects the transformed value.
   * @param event - The input change event.
   */
  toUppercase(event: Event) {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();
    input.value = upperValue;
    this.exportForm.get('currency')?.setValue(upperValue, { emitEvent: false });
    this.cdr.detectChanges(); // Ensure the view updates with the new value
  }

  /**
   * Getter for the currency form control.
   * @returns The currency form control.
   */
  get currencyControl() {
    return this.exportForm.get('currency');
  }

  /**
   * Selects a currency and updates the form control accordingly.
   * Closes the popover and focuses back on the currency input.
   * @param c - The selected currency object containing code and name.
   */
  selectCurrency(c: Currency) {
    this.exportForm.get('currency')?.setValue(c.currCode);
    this.selectCurrencyCode = c.currName;
    this.showPopover = false;
    // Focus back to form after selection
    setTimeout(() => {
      this.focusField('currency');
    }, 100);
  }



  /**
   * Cancels the current operation by closing the currency selection popover.
   */
  cancel() {
    this.showPopover = false;
  }

  /**
   * Sets focus on a specific input field based on its form control name.
   * @param controlName - The name of the form control to focus.
   */
  focusField(controlName: string) {
    const input: HTMLInputElement | null = this.el.nativeElement.querySelector(
      `input[formControlName="${controlName}"]`
    ) as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

  /**
   * Handles keydown events on the currency input field.
   * Shows validation errors and handles special keys like F5 for toggling the popover.
   * @param event - The keyboard event.
   */
  onCurrencyKeyDown(event: KeyboardEvent) {
    // Set flag to show errors when user interacts
    this.showCurrencyErrors = true;

    if (event.key === 'F5') {
      event.preventDefault();
      event.stopPropagation();
      this.showPopover = !this.showPopover;
      return;
    }

    // Handle input validation
    this.handleInputValidation(event);
  }

  /**
   * Validates input for the currency field, preventing invalid characters and enforcing max length.
   * @param event - The keyboard event.
   */
  private handleInputValidation(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value || '';
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];
    
    // Allow Ctrl combinations
    if (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return;
    }
    
    // Prevent non-letter input
    if (!allowedKeys.includes(event.key) && !/^[A-Za-z]$/.test(event.key)) {
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

  /**
   * Marks the currency form control as invalid with a specific error type.
   * @param errorType - The type of validation error to set.
   */
  private markCurrencyAsInvalid(errorType: string) {
    const currencyControl = this.exportForm.get('currency');
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
    const control = this.exportForm.get('currency');
    
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

  /**
   * Handles keydown events on the year input field.
   * Moves focus to the currency input when Enter is pressed.
   * @param event - The keyboard event.
   */
  onYearKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation(); // Important!s
      this.focusField('currency');
    }
  }

    /**
   * Handles form submission.
   * Validates the form and logs the selected year and currency.
   * In a real-world scenario, this would trigger an export action.
   */
  onSubmit() {
    if (this.exportForm.valid) {
      const year = this.exportForm.get('year')?.value;
      const currency = this.exportForm.get('currency')?.value;
      console.log(`Exporting data for year: ${year}, currency: ${currency}`);
      this.loadDashboardData(year, currency); 
      // Here you would typically call a service to handle the export logic
      this.showPopover = false; // Close the popover after submission


    } else {
      console.error('Form is invalid');
    }
  }

    loadDashboardData(CurrYear:string,Usercurrency:string): void {
    this.exportDashboardService
      .fetchTotalExportSummary(
        '/exportDashboard/expHistory',
        { year: CurrYear.toString(), currency: Usercurrency.toString() }
      )
      .subscribe({
        next: (data) => {
          console.log('Total Export LC Summary:', data);
          this.totalExportSummary = data;
        },
        error: (err) => {
          console.error('Failed to fetch Export summary:', err);
        },
      });
  }

  /**
   * Listens for clicks outside the popover to close it.
   * @param ev - The mouse click event.
   */
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.showPopover) return;
    const target = ev.target as HTMLElement;
    if (this.wrapper && !this.wrapper.nativeElement.contains(target)) {
      this.showPopover = false;
    }
  }

  /**
   * Listens for Escape key press to close the popover.
   */
  @HostListener('document:keydown.escape')
  onEsc() {
    this.showPopover = false;
  }
}
