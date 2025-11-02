import { Component } from '@angular/core';
import { ElementRef, Input,HostListener, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-export-transaction-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule, MatButtonModule,MatIconModule,MatDividerModule],
  templateUrl: './export-transaction-dashboard.component.html',
  styleUrl: './export-transaction-dashboard.component.css'
})
export class ExportTransactionDashboardComponent {
   selectedStatus = '';
    selectedType = '';
    @Input() selectedYear!: number;
    showBranchCodeErrors: boolean = false;
  
    constructor(private el: ElementRef,private router: Router) {}
    /** Reference to the year select input field for initial focus. */
     @ViewChild('branchCode') branchCode!: ElementRef<HTMLInputElement>;
  
   /**
     * Focuses the year select input field after the view has been initialized.
     */
    ngAfterViewInit() {
      setTimeout(() => {
        this.branchCode?.nativeElement.focus();
      }, 0);
    }
  
      /** Reactive form group for managing export form inputs (year and currency). */
      tranForm: FormGroup = new FormGroup({
        
        branchCode: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
        ]),
        search: new FormControl(''),
       
      });
  
  
      /**
     * Submits the form by triggering data loading from the dashboard service.
     */
    onSubmit() {
      console.log('Form submitted press done ');
      //this.loadDashboardData();
    }
  
    /**
     * Handles keydown events for form navigation and input validation:
     * - Enter: submits form or moves focus to next field.
     * - F2: moves focus to previous field.
     * - Validates branch code (digits only) and currency code (letters only, max 3 chars).
     */
    onKeyDownPress(event: KeyboardEvent,nextControl?: string, isLast: boolean = false) {
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
        }
  
        if (nextControl) {
          this.focusField(nextControl);
        }
      }
  
      if (key === 'F2') {
        event.preventDefault();
  
        const fieldOrder = ['branchCode', 'search'];
  
        // Try to get current field name from formControlName or id
        let currentField: string | null = null;
  
        if (target.hasAttribute('formControlName')) {
          currentField = target.getAttribute('formControlName');
        } else if (target.id) {
          currentField = target.id;
        }
  
        if (currentField && fieldOrder.includes(currentField)) {
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
          // Allow navigation/editing keys
        } else if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(key.toLowerCase())) {
          // Allow common clipboard shortcuts
        } else if (!/^[0-9]$/.test(key)) {
          event.preventDefault();
          this.markBranchCodeAsInvalid('pattern');
          this.showBranchCodeErrors = true;
          return;
        } else {
          this.showBranchCodeErrors = false;
        }
      }
    }
  
      /**
     * Provides a user-friendly error message for the branch code field based on validation state.
     * @returns Error message string or empty if no error.
     */
    get branchCodeErrorMessage(): string {
      const control = this.tranForm.get('branchCode');
      if (this.showBranchCodeErrors && control?.errors?.['pattern']) {
        return 'Branch code must contain only digits.';
      }
  
      if ((control?.dirty || control?.touched) && (!control.value || control.value.trim() === '')) {
        if (!this.showBranchCodeErrors) {
          return 'For All Branch';
        } else if (control?.errors?.['pattern']) {
          return 'Branch code must contain only digits.';
        }
      }
  
      if ((control?.dirty || control?.touched) && control?.errors) {
        if (control.errors['pattern']) {
          return 'Branch code must contain only digits.';
        }
      }
  
      return '';
    }
  
  
     /**
     * Focuses the specified form control by its formControlName attribute.
     * @param controlName The name of the form control to focus.
     */
   focusField(controlName: string) {
    let element: HTMLElement | null = null;
  
    // First, try to find by formControlName (for inputs bound to form controls)
    element = this.el.nativeElement.querySelector(`[formControlName="${controlName}"]`);
  
    // If not found, try by id (useful for buttons, divs, etc.)
    if (!element) {
      element = this.el.nativeElement.querySelector(`#${controlName}`);
    }
  
    if (element) {
      element.focus();
    }
  }
  
     /**
     * Marks the branch code form control as invalid with a specific error type.
     * @param errorType The type of validation error (e.g., 'pattern').
     */
    private markBranchCodeAsInvalid(errorType: string) {
      const currencyControl = this.tranForm.get('branchCode');
      if (currencyControl) {
        currencyControl.markAsDirty();
        currencyControl.markAsTouched();
  
        if (errorType === 'pattern') {
          currencyControl.setErrors({ pattern: true });
        }
      }
    }
  
    /**
     * Marks the currency code form control as invalid with a specific error type.
     * @param errorType The type of validation error ('pattern' or 'maxlength').
     */
    private markCurrencyAsInvalid(errorType: string) {
      const currencyControl = this.tranForm.get('currencyCode');
      if (currencyControl) {
        currencyControl.markAsDirty();
        currencyControl.markAsTouched();
  
        if (errorType === 'pattern') {
          currencyControl.setErrors({ pattern: true });
        } else if (errorType === 'maxlength') {
          currencyControl.setErrors({ maxlength: true });
        }
      }
    }
  
      /**
     * Clears pattern errors from the branch code field when it becomes empty on blur.
     */
    onBranchCodeBlur() {
      const control = this.tranForm.get('branchCode');
      if (control) {
        if (!control.value || control.value.trim() === '') {
          control.markAsTouched();
          control.markAsDirty();
          if (control.errors?.['pattern']) {
            control.setErrors(null);
          }
        }
      }
    }
  
  
     /**
         * Listens for keyboard events globally to intercept Ctrl+R and prevent browser refresh,
         * instead triggering a route refresh.
         */
        @HostListener('document:keydown', ['$event'])
        handleKeyboardEvent(event: KeyboardEvent) {
          if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            this.refreshRoute();
          }
        }
        /**
     * Refreshes the current route by navigating away and back to it,
     * effectively reloading the component without a full page refresh.
     */
    refreshRoute() {
      const currentUrl = this.router.url;
      this.router.navigate(['/']).then(() => {
        this.router.navigate([currentUrl]);
      });
    }
}
