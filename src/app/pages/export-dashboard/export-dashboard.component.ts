import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, ViewChild } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { DashboardDataService } from "../../services/dashboard/dashboard-data.service";

import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { PageEvent } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { DashboardTranHistoryComponent } from "../../component/dashboard-tran-history/dashboard-tran-history.component";
import { ImportSummaryData } from "../../shared/interface/ImportSummaryData";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Route, Router } from "@angular/router";
import { ImportLcOpenDetailsData } from "../../shared/interface/ImportLcOpenDetailsData";
import { DynamicTableDialogComponent } from "../../component/dynamic-table-dialog/dynamic-table-dialog.component";
import { MatIcon } from "@angular/material/icon";
import { ImportPndingLcDetailsData, PendingLcPageResponse } from "../../shared/interface/ImportPndingLcDetailsData";
import { ImportLcTotalAmountData } from "../../shared/interface/ImportLcTotalAmountData";
import { PageResponse } from "../../shared/interface/PageResponse";
import { ImportBillAmtDetailsData } from "../../shared/interface/ImportBillAmtDetailsData";
import { ImportLcOsAmtDetailsData } from "../../shared/interface/ImportLcOsAmtDetailsData";
import { ImportPayAmtDetailsData } from "../../shared/interface/ImportPayAmtDetailsData";
import { ImportPayPadAmtDetailsData } from "../../shared/interface/ImportPayPadAmtDetailsData";
import { ImportPayPadOsDetailsData } from "../../shared/interface/ImportPayPadOsDetailsData";
import { ImportCommChgDetailsData } from "../../shared/interface/ImportCommChgDetailsData";
import { ImportBillAccAmtDetailsData } from "../../shared/interface/ImportBillAccAmtDetailsData";
import { ImportPayChgAmtDetailsData } from "../../shared/interface/ImportPayChgAmtDetailsData";
import { MatButtonModule } from "@angular/material/button";
import { DashboardCardComponent } from "../../component/dashboard-card/dashboard-card.component";
import { ImportOpenCharge } from "../../shared/interface/ImportOpenCharge.model";
import { ImportLcVatDetailsData } from "../../shared/interface/ImportLcVatDetailsData";
import { ImportLcTaxDetailsData } from "../../shared/interface/ImportLcTaxDetailsData";
import { Currency } from "../../shared/interface/Currency";
import { ExportSummaryData } from "../../shared/interface/ExportSummaryData";
import { ExportDashServiceService } from "../../services/export-dashboard/export-dash-service.service";

@Component({
    selector: "app-export-dashboard",
    standalone: true,
    imports: [MatCardModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatIcon,
        DynamicTableDialogComponent,
        MatButtonModule,
        DashboardCardComponent],
    templateUrl: "./export-dashboard.component.html",
    styleUrl: "./export-dashboard.component.css",
    animations: [
        trigger("slideIn", [
            transition(":enter", [style({ transform: "translateX(100%)", opacity: 0 }), animate("400ms cubic-bezier(0.25)", style({ transform: "translateX(0)", opacity: 1 }))]),
            transition(":leave", [
                style({ transform: "translateX(0)", opacity: 1 }),
                animate("400ms cubic-bezier(0.25, 0.8, 0.25, 1)", style({ transform: "translateX(-100%)", opacity: 0 })),
            ]),
        ]),
    ],
})
export class ExportDashboardComponent {
    viewMode: "cards" | "details" = "cards";
    selectedYear: number = new Date().getFullYear();
    selectCurrencyCode: string = "";
    showBranchCodeErrors: boolean = false;
    showCurrencyErrors: boolean = false;
    currentDetailData: any = null;
    years: number[] = [];

     // Currency map for symbols
    currencyMap = new Map([
        ["USD", "$"],
        ["EUR", "€"],
        ["BDT", "৳"],
        ["GBP", "£"],
        ["JPY", "¥"],
        ["INR", "₹"],
        ["CAD", "CA$"],
        ["AUD", "A$"],
    ]);
    

    totalExportSummary: ExportSummaryData = {
        totalExportOpen: "0",
        totalOrderOpen: "0",
        totalBtbOpen: "0",
        totalExportAmount: "0.00",
        totalOrderAmount: "0.00",
        totalBtbAmount: "0.00",
        totalBtbOsAmount: "0.00",
        totalBtbBillAmount: "0.00",
        totalBtbPayAmount: "0.00",
        totalBtbPadAmount: "0.00",
        totalBtbPadOsAmount: "0.00",
        totalExOrPCAmount: "0.00",
        totalExOrBillAmount: "0.00",
        totalExOrPLAmount: "0.00",
        totalExOrDisbAmount: "0.00",
        totalExEdfRecAmount: "0.00",
    };

    currentDetailView:
        | "pendingLc"
        | "lcOpen"
        | "importAmt"
        | "importBill"
        | "importOsAmt"
        | "importPayAmt"
        | "importPayPadAmt"
        | "importPayPadOs"
        | "importCommChg"
        | "importBillAcc"
        | "importPayChg"
        | "importOpnChg"
        | "importVatAmt"
        | "importTaxAmt"
        | null = null;

    paginationState = {
        lcOpen: { totalItems: 0, currentPage: 0, pageSize: 10 },
        pendingLc: { totalItems: 0, currentPage: 0, pageSize: 10 },
        importAmt: { totalItems: 0, currentPage: 0, pageSize: 10 },
        importBill: { totalItems: 0, currentPage: 0, pageSize: 10 },
        importOsAmt: { totalItems: 0, currentPage: 0, pageSize: 10 },
        importPayAmt: { totalItems: 0, currentPage: 0, pageSize: 10 },
        importPayPadAmt: { totalItems: 0, currentPage: 0, pageSize: 10 },
        importPayPadOs: { totalItems: 0, currentPage: 0, pageSize: 10 },
        importCommChg: { totalItems: 0, currentPage: 0, pageSize: 10 },
        importBillAcc: { totalItems: 0, currentPage: 0, pageSize: 10 },
        importPayChgAmt: { totalItems: 0, currentPage: 0, pageSize: 10 },
        importOpnChg: { totalItems: 0, currentPage: 0, pageSize: 10 },
        importVatAmt: { totalItems: 0, currentPage: 0, pageSize: 10 },
        importTaxAmt: { totalItems: 0, currentPage: 0, pageSize: 10 },
    };
    currencies: Currency[] = [];

    /** Reference to the year select input field for initial focus. */
    @ViewChild("yearSelect") yearSelect!: ElementRef<HTMLSelectElement>;

    /**
     * Initializes the component by populating the years array from 2015 to the current year.
     */
    ngOnInit() {
        const startYear = 2015;
        const currentYear = new Date().getFullYear();
        for (let year = startYear; year <= currentYear; year++) {
            this.years.push(year);
        }
        
    }

    /**
     * Focuses the year select input field after the view has been initialized.
     */
    ngAfterViewInit() {
        //this.cdr.detectChanges();
        setTimeout(() => {
            this.yearSelect?.nativeElement.focus();
        }, 0);
        
    }

    constructor(private exportDashboardService: ExportDashServiceService,private dashboardService: DashboardDataService, private dialog: MatDialog, private cdr: ChangeDetectorRef, private el: ElementRef, private router: Router) {}

    /**
     * Listens for keyboard events globally to intercept Ctrl+R and prevent browser refresh,
     * instead triggering a route refresh.
     */
    @HostListener("document:keydown", ["$event"])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === "r") {
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
        this.router.navigate(["/"]).then(() => {
            this.router.navigate([currentUrl]);
        });
    }

    /** Reactive form group for managing export form inputs (year and currency). */
    exportForm: FormGroup = new FormGroup({
        year: new FormControl(this.selectedYear, [Validators.required]),
        branchCode: new FormControl("", [Validators.required, Validators.pattern(/^[0-9]+$/)]),
        currencyCode: new FormControl(this.selectCurrencyCode, [Validators.required, Validators.maxLength(3), Validators.pattern(/^[A-Za-z]+$/)]),
        search: new FormControl(""),
    });

    /**
     * Submits the form by triggering data loading from the dashboard service.
     */
    onSubmit() {
        console.log("Form submitted press done ");
        this.loadDashboardData();
    }


    /**
     * Retrieves the currency symbol based on the selected currency code.
     * Falls back to '$' if not found.
     * @returns The currency symbol as a string.
     */
    getCurrencySymbol(): string {
        const currencyCode = this.exportForm.get("currencyCode")?.value || this.selectCurrencyCode;
        return this.currencyMap.get(currencyCode?.toUpperCase()) || "$";
    }

    /**
     * Fetches the total export LC summary data based on current form values (year, branch, currency).
     */
    loadDashboardData(): void {
        this.exportDashboardService
            .fetchTotalExportSummary("/exportDashboard/expHistory", {
                year: this.exportForm.get("year")?.value || "",
                branchCode: this.exportForm.get("branchCode")?.value || "",
                currency: this.exportForm.get("currencyCode")?.value || "",
            })
            .subscribe({
                next: (data) => {
                    console.log("Total Export LC Summary:", data);
                    this.totalExportSummary = data;
                },
                error: (err) => {
                    console.error("Failed to fetch Export summary:", err);
                },
            });
    }

    /**
     * Updates the selected year from the form control (currently unused for data reload).
     */
    onYearChange(): void {
        this.yearSelect = this.exportForm.get("year")?.value;
    }

     onClickHoverTest() {
        console.log("Clicked on View Details Button");
    }

    /**
     * Handles keydown events for form navigation and input validation:
     * - Enter: submits form or moves focus to next field.
     * - F2: moves focus to previous field.
     * - Validates branch code (digits only) and currency code (letters only, max 3 chars).
     */
    onKeyDownPress(event: KeyboardEvent, nextControl?: string, isLast: boolean = false): void {
        const key = event.key;
        const target = event.target as HTMLInputElement;

        // Handle Enter
        if (key === "Enter") {
            this.handleEnterKey(event, target, nextControl, isLast);
            return;
        }

        // Handle F2
        if (key === "F2") {
            this.handleF2Key(event, target);
            return;
        }

        // Validate branchCode
        if (target?.getAttribute("formControlName") === "branchCode") {
            this.validateBranchCodeInput(event, target);
            return;
        }

        // Validate currencyCode
        if (target?.getAttribute("formControlName") === "currencyCode") {
            this.validateCurrencyCodeInput(event, target);
        }
    }

    // ─── ENTER KEY ───────────────────────────────────────────────
    private handleEnterKey(event: KeyboardEvent, target: HTMLInputElement, nextControl?: string, isLast: boolean = false): void {
        event.preventDefault();

        if (isLast) {
            this.onSubmit();
            return;
        }

        if (target.getAttribute("formControlName") === "branchCode") {
            this.showBranchCodeErrors = false;
        }

        if (nextControl) {
            this.focusField(nextControl);
        }
    }

    // ─── F2 KEY (PREVIOUS FIELD) ─────────────────────────────────
    private handleF2Key(event: KeyboardEvent, target: Element): void {
        event.preventDefault();

        const fieldOrder = ["year", "branchCode", "currencyCode", "search"];
        let currentField: string | null = null;

        if (target.hasAttribute("formControlName")) {
            currentField = target.getAttribute("formControlName");
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
    }

    // ─── BRANCH CODE VALIDATION ──────────────────────────────────
    private validateBranchCodeInput(event: KeyboardEvent, input: HTMLInputElement): void {
        const key = event.key;
        const controlKeys = ["Backspace", "Tab", "Delete", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];

        const isControlKey = controlKeys.includes(key);
        const isClipboardShortcut = (event.ctrlKey || event.metaKey) && ["a", "c", "v", "x", "z"].includes(key.toLowerCase());

        if (isControlKey || isClipboardShortcut) {
            return; // Allow
        }

        if (!/^[0-9]$/.test(key)) {
            event.preventDefault();
            this.markBranchCodeAsInvalid("pattern");
            this.showBranchCodeErrors = true;
        } else {
            this.showBranchCodeErrors = false;
        }
    }

    /**
     * Clears pattern errors from the branch code field when it becomes empty on blur.
     */
    onBranchCodeBlur() {
        const control = this.exportForm.get("branchCode");
        if (control) {
            if (!control.value || control.value.trim() === "") {
                control.markAsTouched();
                control.markAsDirty();
                if (control.errors?.["pattern"]) {
                    control.setErrors(null);
                }
            }
        }
    }

    /**
     * Provides a user-friendly error message for the branch code field based on validation state.
     * @returns Error message string or empty if no error.
     */
    get branchCodeErrorMessage(): string {
        const control = this.exportForm.get("branchCode");
        if (this.showBranchCodeErrors && control?.errors?.["pattern"]) {
            return "Branch code must contain only digits.";
        }

        if ((control?.dirty || control?.touched) && (!control.value || control.value.trim() === "")) {
            if (!this.showBranchCodeErrors) {
                return "For All Branch";
            } else if (control?.errors?.["pattern"]) {
                return "Branch code must contain only digits.";
            }
        }

        if ((control?.dirty || control?.touched) && control?.errors) {
            if (control.errors["pattern"]) {
                return "Branch code must contain only digits.";
            }
        }

        return "";
    }

    // ─── CURRENCY CODE VALIDATION ────────────────────────────────
    private validateCurrencyCodeInput(event: KeyboardEvent, input: HTMLInputElement): void {
        const key = event.key;
        const currentValue = input.value || "";

        const controlKeys = ["Backspace", "Tab", "Delete", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];

        const isControlKey = controlKeys.includes(key);
        const isClipboardShortcut = (event.ctrlKey || event.metaKey) && ["a", "c", "v", "x", "z"].includes(key.toLowerCase());

        if (isControlKey || isClipboardShortcut) {
            return; // Allow
        }

        // Block non-letter input
        if (!/^[A-Za-z]$/.test(key)) {
            event.preventDefault();
            this.markCurrencyAsInvalid("pattern");
            return;
        }

        // Block input if length would exceed 3
        if (currentValue.length >= 3) {
            event.preventDefault();
            this.markCurrencyAsInvalid("maxlength");
        }
    }

    /**
     * Converts the currency code input to uppercase on change and updates the form control.
     * @param event The input change event.
     */
    toUppercase(event: Event) {
        const input = event.target as HTMLInputElement;
        const upperValue = input.value.toUpperCase();
        input.value = upperValue;
        this.exportForm.get("currencyCode")?.setValue(upperValue, { emitEvent: false });
        this.cdr.detectChanges();
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
        const currencyControl = this.exportForm.get("branchCode");
        if (currencyControl) {
            currencyControl.markAsDirty();
            currencyControl.markAsTouched();

            if (errorType === "pattern") {
                currencyControl.setErrors({ pattern: true });
            }
        }
    }

    /**
     * Marks the currency code form control as invalid with a specific error type.
     * @param errorType The type of validation error ('pattern' or 'maxlength').
     */
    private markCurrencyAsInvalid(errorType: string) {
        const currencyControl = this.exportForm.get("currencyCode");
        if (currencyControl) {
            currencyControl.markAsDirty();
            currencyControl.markAsTouched();

            if (errorType === "pattern") {
                currencyControl.setErrors({ pattern: true });
            } else if (errorType === "maxlength") {
                currencyControl.setErrors({ maxlength: true });
            }
        }
    }

    /**
     * Getter for the currency error message based on current validation state.
     * @returns A user-friendly error message if validation fails.
     */
    get currencyErrorMessage(): string {
        const control = this.exportForm.get("currencyCode");

        if ((control?.dirty || control?.touched || this.showCurrencyErrors) && control?.errors) {
            if (control.errors["required"]) {
                return "Currency code is required.";
            }
            if (control.errors["maxlength"]) {
                return "Currency code must be 3 characters.";
            }
            if (control.errors["pattern"]) {
                return "Currency code must contain only letters.";
            }
        }
        return "";
    }

    /**
     * Switches the view back to card mode and clears detail view state.
     */
    goBackToCards() {
        this.viewMode = "cards";
        this.currentDetailView = null;
        this.currentDetailData = null;
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
        if (this.currentDetailView === "importAmt") {
            this.paginationState.importAmt.currentPage = event.pageIndex;
            this.paginationState.importAmt.pageSize = event.pageSize;
            //this.loadImportAmountDetails();
        }
        if (this.currentDetailView === "lcOpen") {
            this.paginationState.lcOpen.currentPage = event.pageIndex;
            this.paginationState.lcOpen.pageSize = event.pageSize;
            //this.loadImportOpenDetails();
        }
        if (this.currentDetailView === "importBill") {
            this.paginationState.importBill.currentPage = event.pageIndex;
            this.paginationState.importBill.pageSize = event.pageSize;
            //this.loadImportBillDetails();
        }
        if (this.currentDetailView === "importOsAmt") {
            this.paginationState.importOsAmt.currentPage = event.pageIndex;
            this.paginationState.importOsAmt.pageSize = event.pageSize;
            //this.loadImportOsDetails();
        }
        if (this.currentDetailView === "importPayAmt") {
            this.paginationState.importPayAmt.currentPage = event.pageIndex;
            this.paginationState.importPayAmt.pageSize = event.pageSize;
            //this.loadImportPayDetails();
        }
        if (this.currentDetailView === "importPayPadAmt") {
            this.paginationState.importPayPadAmt.currentPage = event.pageIndex;
            this.paginationState.importPayPadAmt.pageSize = event.pageSize;
            //this.loadImportPadDetails();
        }
        if (this.currentDetailView === "importPayPadOs") {
            this.paginationState.importPayPadOs.currentPage = event.pageIndex;
            this.paginationState.importPayPadOs.pageSize = event.pageSize;
            //this.loadImportPadOsDetails();
        }
        if (this.currentDetailView === "importCommChg") {
            this.paginationState.importCommChg.currentPage = event.pageIndex;
            this.paginationState.importCommChg.pageSize = event.pageSize;
            //this.loadImportCommDetails();
        }
        if (this.currentDetailView === "importBillAcc") {
            this.paginationState.importBillAcc.currentPage = event.pageIndex;
            this.paginationState.importBillAcc.pageSize = event.pageSize;
            //this.loadImportAccDetails();
        }
        if (this.currentDetailView === "importPayChg") {
            this.paginationState.importPayChgAmt.currentPage = event.pageIndex;
            this.paginationState.importPayChgAmt.pageSize = event.pageSize;
            //this.loadImportPayChgDetails();
        }
        if (this.currentDetailView === "importOpnChg") {
            this.paginationState.importOpnChg.currentPage = event.pageIndex;
            this.paginationState.importOpnChg.pageSize = event.pageSize;
            //this.loadImportOpenChgDetails();
        }
        if (this.currentDetailView === "importVatAmt") {
            this.paginationState.importVatAmt.currentPage = event.pageIndex;
            this.paginationState.importVatAmt.pageSize = event.pageSize;
            //this.loadImportVatDetails();
        }
        if (this.currentDetailView === "importTaxAmt") {
            this.paginationState.importTaxAmt.currentPage = event.pageIndex;
            this.paginationState.importTaxAmt.pageSize = event.pageSize;
            //this.loadImportTaxDetails();
        }
    }
    private formatAmount(value: number | null | undefined): string {
        if (value === null || value === undefined) return "0.00";
        return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
        
}
