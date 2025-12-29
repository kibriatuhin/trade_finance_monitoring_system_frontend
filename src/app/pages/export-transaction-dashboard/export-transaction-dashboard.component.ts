import { Component } from '@angular/core';
import { ElementRef, Input,HostListener, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { AdBranchDetailsData } from '../../shared/models/branch/AdBranchDetailsData.model';
import { DashboardDataService } from '../../services/dashboard/dashboard-data.service';
import { PageResponse } from '../../shared/interface/PageResponse';


@Component({
  selector: 'app-export-transaction-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './export-transaction-dashboard.component.html',
  styleUrl: './export-transaction-dashboard.component.css'
})
export class ExportTransactionDashboardComponent {
   selectedStatus = '';
    selectedType = '';
    @Input() selectedYear!: number;
    showBranchCodeErrors: boolean = false;
  
    constructor(private el: ElementRef,private router: Router,private dashboardService: DashboardDataService,) {}
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



    /**
     * For dynamic  table  Test
     */
    currentDetailData: any = null;
    adBranchDetails: AdBranchDetailsData[] = [];
    currentDetailView:
        | "pendingLc"
        | "adBranch"
        | null = null;
     paginationState = {
        pendingLc: { totalItems: 0, currentPage: 0, pageSize: 10 },
        adBranch : { totalItems: 0, currentPage: 0, pageSize: 10 }
     }

     ngOnInit(): void {
        this.loadAdBranchDetails(); // initial load
        this.adBranchDetailsDialog();
    }



     /**
              * Opens the Ad Branch detail view, loads data, and configures the table.
         */
         adBranchDetailsDialog() {
             this.currentDetailView = "adBranch";
     
             const columns = [
                 { key: "rn", label: "RN", cssClass: "min-w-[70px] w-[100px]", },
                 { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[150px]", },
                 { key: "brnName", label: "Name", cssClass: "min-w-[200px] w-[550px]", },
                 { key: "brnAddr", label: "Address", cssClass: "min-w-[150px] w-[450px]", },
                 { key: "brnOpnDate", label: "Open Date", cssClass: "min-w-[130px] w-[170px]", },
                 { key: "brnCurr", label: "Currency", cssClass: "min-w-[90px] w-[150px]", },
                 { key: "brnDlrCode", label: "AD Code", cssClass: "min-w-[120px] w-[250px]", },
                 { key: "brnSwfCode", label: "Swift Code", cssClass: "min-w-[170px] w-[250px]", },
     
             ];
     
             this.paginationState.adBranch.currentPage = 0;
     
             this.loadAdBranchDetails()
                 .then(() => {
                     console.log("Data loaded:", this.adBranchDetails);
     
                     if (this.adBranchDetails && this.adBranchDetails.length > 0) {
                         this.currentDetailData = {
                             title: "View AD Branch Details",
                             columns: columns,
                             tableData: this.adBranchDetails,
                             totalItems: this.paginationState.adBranch.totalItems,
                             pageSize: this.paginationState.adBranch.pageSize,
                             currentPage: this.paginationState.adBranch.currentPage,
                             showActionColumn: true,          // 👈 control here
                             actionLabel: 'Details',     
                         };
                     } else {
                         console.warn("No data available for display");
                         this.currentDetailData = {
                             title: "View AD Branch Details",
                             columns: columns,
                             tableData: [],
                             totalItems: 0,
                             pageSize: this.paginationState.adBranch.pageSize,
                             currentPage: this.paginationState.adBranch.currentPage,
                         };
                     }
                     //this.viewMode = "details";
                 })
                 .catch((error) => {
                     console.error("Error loading data:", error);
                     this.currentDetailData = {
                         title: "View AD Branch Details",
                         columns: columns,
                         tableData: [],
                         totalItems: 0,
                         pageSize: this.paginationState.adBranch.pageSize,
                         currentPage: this.paginationState.adBranch.currentPage,
                     };
                     //this.viewMode = "details";
                 });
         }
     
         /**
          * Loads paginated AD Branch details from the backend.
          * @returns A promise that resolves when data is loaded or rejects on error.
          */
         loadAdBranchDetails(): Promise<void> {
             const { currentPage, pageSize } = this.paginationState.adBranch;
     
             return new Promise((resolve, reject) => {
                 this.dashboardService
                     .getPagedData<AdBranchDetailsData>("/branch/AdbrnDtls", {
                         pageNo: currentPage,
                         pageSize: pageSize,
                     })
                     .subscribe({
                         next: (pageResponse: PageResponse<AdBranchDetailsData>) => {
                             console.log("Page Response:", pageResponse);
                             this.adBranchDetails = pageResponse.lcList.map((item) => ({
                                 ...item,
     
                             }));
                             //this.lcOpenDetails = pageResponse.lcList;
                             this.paginationState.adBranch.totalItems = pageResponse.totalElements;
                             this.paginationState.adBranch.pageSize = pageResponse.pageSize;
                             this.paginationState.adBranch.currentPage = pageResponse.pageNo;
     
                             this.updateLcDialogData();
                             resolve();
                         },
                         error: (err) => {
                             console.error("Failed to fetch AD Branch details:", err);
                             this.adBranchDetails = [];
                             this.paginationState.adBranch.totalItems = 0;
                             this.updateLcDialogData();
                             reject(err);
                         },
                     });
             });
         }

  /**
     * Updates the current detail dialog data based on the active view type
     * to reflect the latest table data and pagination state.
     */
    private updateLcDialogData() {
        if (this.currentDetailView === "adBranch" ) {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.adBranchDetails,
                totalItems: this.paginationState.adBranch.totalItems,
                pageSize: this.paginationState.adBranch.pageSize,
                currentPage: this.paginationState.adBranch.currentPage,
            };
        }
       

    }

    /**
      * Handles pagination events and reloads the appropriate data set
      * based on the currently active detail view.
      * @param event The pagination event containing page index and size.
     */
        onPageChangeHandler(event: PageEvent) {
            if (this.currentDetailView === "pendingLc") {
                this.paginationState.pendingLc.currentPage = event.pageIndex;
                this.paginationState.pendingLc.pageSize = event.pageSize;
                //this.loadImportPendingLcDetails();
            }
        }
}
