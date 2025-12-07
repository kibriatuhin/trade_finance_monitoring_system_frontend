import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, ViewChild } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { DashboardDataService } from "../../services/dashboard/dashboard-data.service";

import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";

import { trigger, state, style, transition, animate } from "@angular/animations";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Route, Router } from "@angular/router";
import { DynamicTableDialogComponent } from "../../component/dynamic-table-dialog/dynamic-table-dialog.component";
import { MatIcon } from "@angular/material/icon";
import { PageResponse } from "../../shared/interface/PageResponse";
import { MatButtonModule } from "@angular/material/button";
import { DashboardCardComponent } from "../../component/dashboard-card/dashboard-card.component";
import { Currency } from "../../shared/interface/Currency";
import { ExportSummaryData } from "../../shared/models/export/ExportSummaryData";
import { ExportDashServiceService } from "../../services/export-dashboard/export-dash-service.service";
import { ExportOpenDetailsModel } from "../../shared/models/export/export-open-details.model";
import { OrderOpenDetailsModel } from "../../shared/models/export/order-open-details.model";
import { ExOrdBtbOpenDetailsModel } from "../../shared/models/export/btb/export-btb-open-details.model";
import { ExportVolumeDetailsData } from "../../shared/models/export/exportVolume-details.model";
import { OrderVolumeDetailsData } from "../../shared/models/export/orderVolume-details.model";
import { ExpOrdBtbVolDetailsData } from "../../shared/models/export/btb/expOrdBTB-details.model";
import { ExpOrdBtbOsDetailsData } from "../../shared/models/export/btb/expOrdBtbOs-details.model";
import { ExpOrdBTbBillDetailsData } from "../../shared/models/export/btb/expOrdBtbBill-details.model";
import { ExpOrdBtbPayDetailsData } from "../../shared/models/export/btb/expOrdBtbPay-details.model";
import { ExpOrdBtbPadDetailsData } from "../../shared/models/export/btb/expOrdBtbPad-details.model";
import { ExpOrdBtbPadOsDetailsData } from "../../shared/models/export/btb/expOrdBtbPadOs-details.model";
import { ExpOrdPcAmtDetailsData } from "../../shared/models/export/exportPcAmt-details.model";
import { ExpOrdBillAmtDetailsData } from "../../shared/models/export/exportBillAmt-details.model";
import { ExpOrdPlLoanDetailsData } from "../../shared/models/export/expOrdPLAmt-details.model";
import { ExpOrdDisbAmtDetailsData } from "../../shared/models/export/expOrdDisbAmt-details.model";
import { ExpOrdEdfRcDetailsData } from "../../shared/models/export/expOrdEdfRc-details.model";

@Component({
    selector: "app-export-dashboard",
    standalone: true,
    imports: [MatCardModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, MatIcon, DynamicTableDialogComponent, MatButtonModule, DashboardCardComponent],
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
    currencies: Currency[] = [];

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
    expOpenDetails: ExportOpenDetailsModel[] = [];
    ordOpenDetails: OrderOpenDetailsModel[] = [];
    expOrdBtbOpenDetails: ExOrdBtbOpenDetailsModel[] = [];
    expVolumeDetails: ExportVolumeDetailsData[] = [];
    ordVolumeDetails: OrderVolumeDetailsData[] = [];
    expOrdBtbVolumeDetails: ExpOrdBtbVolDetailsData[] = [];
    expOrdBTbOsAmtDetails: ExpOrdBtbOsDetailsData[] = [];
    expOrdBtbBillDetails: ExpOrdBTbBillDetailsData[] = [];
    expOrdBtbPayDetails: ExpOrdBtbPayDetailsData[] = [];
    expOrdPadDetails: ExpOrdBtbPadDetailsData[] = [];
    expOrdPadOsDetails: ExpOrdBtbPadOsDetailsData[] = [];
    expOrdPcAmtDetails: ExpOrdPcAmtDetailsData[] = [];
    expOrdBillAmtDetails: ExpOrdBillAmtDetailsData[] = [];
    expOrdPlAmtDetails: ExpOrdPlLoanDetailsData[] = [];
    expOrdDisbAmtDetails: ExpOrdDisbAmtDetailsData[] = [];
    expordEdfRcDetails: ExpOrdEdfRcDetailsData[] = [];

    currentDetailView: "exportOpen" 
                      | "orderOpen" 
                      | "btbOpen" 
                      | "exportVolume" 
                      | "orderVolume" 
                      | "btbVolume"
                      | "btbOsAmount"
                      | "btbBillAmount"
                      | "btbPayAmount"
                      | "btbPadAmount"
                      | "btbPadOsAmount"
                      | "expOrdPcAmount"
                      | "expOrdBillAmt"
                      | "expOrdPlAmt"
                      | "expOrdDisbAmt"
                      | "expOrdEdfRc"
                      | null = null;

    paginationState = {
        exportOpen: { totalItems: 0, currentPage: 0, pageSize: 10 },
        orderOpen: { totalItems: 0, currentPage: 0, pageSize: 10 },
        btbOpen: { totalItems: 0, currentPage: 0, pageSize: 10 },
        exportVolume: { totalItems: 0, currentPage: 0, pageSize: 10 },
        orderVolume: { totalItems: 0, currentPage: 0, pageSize: 10 },
        btbVolume: { totalItems: 0, currentPage: 0, pageSize: 10 },
        btbOsAmount: { totalItems: 0, currentPage: 0, pageSize: 10 },
        btbBillAmount: { totalItems: 0, currentPage: 0, pageSize: 10 },
        btbPayAmount: { totalItems: 0, currentPage: 0, pageSize: 10 },
        btbPadAmount: { totalItems: 0, currentPage: 0, pageSize: 10 },
        btbPadOsAmount: { totalItems: 0, currentPage: 0, pageSize: 10 },
        expOrdPcAmount: { totalItems: 0, currentPage: 0, pageSize: 10 },
        expOrdBillAmt: { totalItems: 0, currentPage: 0, pageSize: 10 },
        expOrdPlAmt: { totalItems: 0, currentPage: 0, pageSize: 10 },
        expOrdDisbAmt: { totalItems: 0, currentPage: 0, pageSize: 10 },
        expOrdEdfRc: { totalItems: 0, currentPage: 0, pageSize: 10 },
    };

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

    constructor(
        private exportDashboardService: ExportDashServiceService,
        private dashboardService: DashboardDataService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private el: ElementRef,
        private router: Router
    ) {}

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
     * Opens the "Export LC Open" detail view, loads data, and configures the table.
     */
    ExportLcOpenDialog() {
        this.currentDetailView = "exportOpen";

        const columns = [
            { key: "rn", label: "RN" },
            {
                key: "brnCode",
                label: "Branch Code",
                cssClass: "min-w-[90px] w-[200px]",
            },
            {
                key: "exRefNum",
                label: "LC Ref. NO",
                cssClass: "min-w-[150px] w-[150px]",
            },
            { key: "custNum", label: "Cust. Number" },
            { key: "lcCurr", label: "Currency" },
            {
                key: "lcAmount",
                label: "Lc Open Amt",
                cssClass: "min-w-[150px] w-[150px]",
            },
            { key: "entdBy", label: "Entd. By" },
            {
                key: "entdOn",
                label: "Entd. On",
                cssClass: "min-w-[220px] w-[220px]",
            },
        ];

        this.paginationState.exportOpen.currentPage = 0;

        this.loadExportOpenDetails()
            .then(() => {
                console.log("Data loaded:", this.expOpenDetails);

                if (this.expOpenDetails && this.expOpenDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Export Open Details",
                        columns: columns,
                        tableData: this.expOpenDetails,
                        totalItems: this.paginationState.exportOpen.totalItems,
                        pageSize: this.paginationState.exportOpen.pageSize,
                        currentPage: this.paginationState.exportOpen.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Export Open Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.exportOpen.pageSize,
                        currentPage: this.paginationState.exportOpen.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Export Open Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.exportOpen.pageSize,
                    currentPage: this.paginationState.exportOpen.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated export LC open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExportOpenDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.exportOpen;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ExportOpenDetailsModel>("/exportDashboard/expOpnDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExportOpenDetailsModel>) => {
                        console.log("Export open Response:", pageResponse);
                        this.expOpenDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcAmount: this.formatAmount(Number(item.lcAmount)),
                        }));
                        // this.importOpenChargeDetails = pageResponse.lcList;
                        this.paginationState.exportOpen.totalItems = pageResponse.totalElements;
                        this.paginationState.exportOpen.pageSize = pageResponse.pageSize;
                        this.paginationState.exportOpen.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Export open details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.exportOpen.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Order LC Open" detail view, loads data, and configures the table.
     */
    OrderLcOpenDialog() {
        this.currentDetailView = "orderOpen";

        const columns = [
            { key: "rn", label: "RN" },
            {
                key: "brnCode",
                label: "Branch Code",
                cssClass: "min-w-[90px] w-[200px]",
            },
            {
                key: "orRefNum",
                label: "LC Ref. NO",
                cssClass: "min-w-[150px] w-[150px]",
            },
            { key: "custNum", label: "Cust. Number" },
            { key: "lcCurr", label: "Currency" },
            {
                key: "lcAmount",
                label: "Lc Open Amt",
                cssClass: "min-w-[150px] w-[150px]",
            },
            { key: "entdBy", label: "Entd. By" },
            {
                key: "entdOn",
                label: "Entd. On",
                cssClass: "min-w-[220px] w-[220px]",
            },
        ];

        this.paginationState.orderOpen.currentPage = 0;

        this.loadOrderOpenDetails()
            .then(() => {
                console.log("Data loaded:", this.ordOpenDetails);

                if (this.ordOpenDetails && this.ordOpenDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Order Open Details",
                        columns: columns,
                        tableData: this.ordOpenDetails,
                        totalItems: this.paginationState.orderOpen.totalItems,
                        pageSize: this.paginationState.orderOpen.pageSize,
                        currentPage: this.paginationState.orderOpen.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Order Open Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.orderOpen.pageSize,
                        currentPage: this.paginationState.orderOpen.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Order Open Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.orderOpen.pageSize,
                    currentPage: this.paginationState.orderOpen.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated export LC open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadOrderOpenDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.orderOpen;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<OrderOpenDetailsModel>("/exportDashboard/ordOpnDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<OrderOpenDetailsModel>) => {
                        console.log("Export open Response:", pageResponse);
                        this.ordOpenDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcAmount: this.formatAmount(Number(item.lcAmount)),
                        }));
                        this.paginationState.orderOpen.totalItems = pageResponse.totalElements;
                        this.paginationState.orderOpen.pageSize = pageResponse.pageSize;
                        this.paginationState.orderOpen.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Order open details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.orderOpen.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "BTB LC Open" detail view, loads data, and configures the table.
     */
    ExpOrdBtbLcOpenDialog() {
        this.currentDetailView = "btbOpen";

        const columns = [
            { key: "rn", label: "RN" },
            {
                key: "brnCode",
                label: "Branch Code",
                cssClass: "min-w-[90px] w-[200px]",
            },
            {
                key: "lcRefNum",
                label: "LC Ref. NO",
                cssClass: "min-w-[150px] w-[150px]",
            },
            { key: "custNum", label: "Cust. Number" },
            { key: "lcCurr", label: "Currency" },
            {
                key: "lcAmt",
                label: "Lc Open Amt",
                cssClass: "min-w-[150px] w-[150px]",
            },
            { key: "entdBy", label: "Entd. By" },
            {
                key: "entdOn",
                label: "Entd. On",
                cssClass: "min-w-[220px] w-[220px]",
            },
        ];

        this.paginationState.btbOpen.currentPage = 0;

        this.loadBTBOpenDetails()
            .then(() => {
                console.log("Data loaded:", this.expOrdBtbOpenDetails);

                if (this.expOrdBtbOpenDetails && this.expOrdBtbOpenDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View BTB Open Details",
                        columns: columns,
                        tableData: this.expOrdBtbOpenDetails,
                        totalItems: this.paginationState.btbOpen.totalItems,
                        pageSize: this.paginationState.btbOpen.pageSize,
                        currentPage: this.paginationState.btbOpen.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View BTB Open Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.btbOpen.pageSize,
                        currentPage: this.paginationState.btbOpen.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View BTB Open Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.btbOpen.pageSize,
                    currentPage: this.paginationState.btbOpen.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated btb LC open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadBTBOpenDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.btbOpen;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ExOrdBtbOpenDetailsModel>("/exportDashboard/exOrBtbOpnDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExOrdBtbOpenDetailsModel>) => {
                        console.log("BTB open Response:", pageResponse);
                        this.expOrdBtbOpenDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcAmt: this.formatAmount(Number(item.lcAmt)),
                        }));
                        this.paginationState.btbOpen.totalItems = pageResponse.totalElements;
                        this.paginationState.btbOpen.pageSize = pageResponse.pageSize;
                        this.paginationState.btbOpen.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch BTB open details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.orderOpen.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Export Volume Open" detail view, loads data, and configures the table.
     */
    ExportVolumeOpenDialog() {
        this.currentDetailView = "exportVolume";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            {
                key: "brnCode",
                label: "Branch Code",
                cssClass: "min-w-[90px] w-[200px]",
            },
            {
                key: "lcRefNo",
                label: "LC Ref. NO",
                cssClass: "min-w-[150px] w-[150px]",
            },
            { key: "lcOpSerial", label: "LC Serial", cssClass: "min-w-[90px] w-[150px]" },
            { key: "lcCustNum", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
            { key: "lcCurr", label: "Currency", cssClass: "min-w-[90px] w-[150px]" },
            {
                key: "lcAmount",
                label: "LC Open Amt.",
                cssClass: "min-w-[150px] w-[150px]",
            },
            {
                key: "lcFobAmount",
                label: "LC FOB Amt.",
                cssClass: "min-w-[150px] w-[150px]",
            },
            {
                key: "lcExpiryDate",
                label: "LC Expiry Date",
                cssClass: "min-w-[100px] w-[220px]",
            },
            {
                key: "lcShipDate",
                label: "LC Ship Date",
                cssClass: "min-w-[100px] w-[220px]",
            },
            {
                key: "btbAllowAmt",
                label: "BTB Allow Amt.",
                cssClass: "min-w-[150px] w-[150px]",
            },
            {
                key: "pcAllowAmt",
                label: "PC Allow Amt.",
                cssClass: "min-w-[150px] w-[150px]",
            },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            {
                key: "entdOn",
                label: "Entd. On",
                cssClass: "min-w-[220px] w-[220px]",
            },
        ];

        this.paginationState.exportVolume.currentPage = 0;

        this.loadExpVolOpenDetails()
            .then(() => {
                console.log("Data loaded:", this.expVolumeDetails);

                if (this.expVolumeDetails && this.expVolumeDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Export Volume Open Details",
                        columns: columns,
                        tableData: this.expVolumeDetails,
                        totalItems: this.paginationState.exportVolume.totalItems,
                        pageSize: this.paginationState.exportVolume.pageSize,
                        currentPage: this.paginationState.exportVolume.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Export Volume Open Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.exportVolume.pageSize,
                        currentPage: this.paginationState.exportVolume.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Export Volume Open Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.exportVolume.pageSize,
                    currentPage: this.paginationState.exportVolume.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated Export Volume open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExpVolOpenDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.exportVolume;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ExportVolumeDetailsData>("/exportDashboard/exVolumeDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExportVolumeDetailsData>) => {
                        console.log("Export Volume open Response:", pageResponse);
                        this.expVolumeDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcAmount: this.formatAmount(Number(item.lcAmount)),
                            lcFobAmount: this.formatAmount(Number(item.lcFobAmount)),
                            btbAllowAmt: this.formatAmount(Number(item.btbAllowAmt)),
                            pcAllowAmt: this.formatAmount(Number(item.pcAllowAmt)),
                        }));
                        this.paginationState.exportVolume.totalItems = pageResponse.totalElements;
                        this.paginationState.exportVolume.pageSize = pageResponse.pageSize;
                        this.paginationState.exportVolume.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch BTB open details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.exportVolume.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Order Volume Open" detail view, loads data, and configures the table.
     */
    OrderVolumeOpenDialog() {
        this.currentDetailView = "orderVolume";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[200px]" },
            { key: "ordRefNum", label: "LC Ref. NO", cssClass: "min-w-[150px] w-[150px]" },
            { key: "opSerialNo", label: "LC Serial", cssClass: "min-w-[90px] w-[150px]" },
            { key: "custNum", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
            { key: "lcCurr", label: "Currency", cssClass: "min-w-[90px] w-[150px]" },
            { key: "lcAmount", label: "LC Open Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcFobAmt", label: "LC FOB Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcExpiryDate", label: "LC Expiry Date", cssClass: "min-w-[120px] w-[220px]" },
            { key: "lcShipDate", label: "LC Ship Date", cssClass: "min-w-[120px] w-[220px]" },
            { key: "btbAllowAmt", label: "BTB Allow Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "pcAllowAmt", label: "PC Allow Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]" },
        ];

        this.paginationState.orderVolume.currentPage = 0;

        this.loadOrdVolOpenDetails()
            .then(() => {
                console.log("Data loaded:", this.ordVolumeDetails);

                if (this.ordVolumeDetails && this.ordVolumeDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Order Volume Open Details",
                        columns: columns,
                        tableData: this.ordVolumeDetails,
                        totalItems: this.paginationState.orderVolume.totalItems,
                        pageSize: this.paginationState.orderVolume.pageSize,
                        currentPage: this.paginationState.orderVolume.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Order Volume Open Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.orderVolume.pageSize,
                        currentPage: this.paginationState.orderVolume.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Order Volume Open Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.orderVolume.pageSize,
                    currentPage: this.paginationState.orderVolume.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated Export Volume open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadOrdVolOpenDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.orderVolume;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<OrderVolumeDetailsData>("/exportDashboard/OrdVolAmtDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<OrderVolumeDetailsData>) => {
                        console.log("Order Volume open Response:", pageResponse);
                        this.ordVolumeDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcAmount: this.formatAmount(Number(item.lcAmount)),
                            lcFobAmt: this.formatAmount(Number(item.lcFobAmt)),
                            btbAllowAmt: this.formatAmount(Number(item.btbAllowAmt)),
                            pcAllowAmt: this.formatAmount(Number(item.pcAllowAmt)),
                        }));
                        this.paginationState.orderVolume.totalItems = pageResponse.totalElements;
                        this.paginationState.orderVolume.pageSize = pageResponse.pageSize;
                        this.paginationState.orderVolume.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch BTB open details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.orderVolume.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }
    /**
     * Opens the "BTB Volume Open" detail view, loads data, and configures the table.
     */
    ExpOrdBTBVolumeOpenDialog() {
        this.currentDetailView = "btbVolume";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[200px]" },
            { key: "btbRefNo", label: "LC Ref. NO", cssClass: "min-w-[150px] w-[150px]" },
            { key: "exOrRefNum", label: "LC Serial", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcCustNum", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
            { key: "lcCurrCode", label: "Currency", cssClass: "min-w-[90px] w-[150px]" },
            { key: "lcAmount", label: "LC Open Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcEnAmt", label: "LC En. Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcRdAmt", label: "LC Rd. Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcTotalAmount", label: "Total Amount", cssClass: "min-w-[150px] w-[150px]" },
            { key: "tranBatchNo", label: "Batch Num.", cssClass: "min-w-[100px] w-[220px]" },
            { key: "tranDate", label: "Tran Date", cssClass: "min-w-[120px] w-[220px]" },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]" },
        ];

        this.paginationState.btbVolume.currentPage = 0;

        this.loadExpOrdBTBVolOpenDetails()
            .then(() => {
                console.log("Data loaded:", this.expOrdBtbVolumeDetails);

                if (this.expOrdBtbVolumeDetails && this.expOrdBtbVolumeDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View BTB Volume Open Details",
                        columns: columns,
                        tableData: this.expOrdBtbVolumeDetails,
                        totalItems: this.paginationState.btbVolume.totalItems,
                        pageSize: this.paginationState.btbVolume.pageSize,
                        currentPage: this.paginationState.btbVolume.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View BTB Volume Open Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.btbVolume.pageSize,
                        currentPage: this.paginationState.btbVolume.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View BTB Volume Open Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.btbVolume.pageSize,
                    currentPage: this.paginationState.btbVolume.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated BTB Volume open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExpOrdBTBVolOpenDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.btbVolume;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ExpOrdBtbVolDetailsData>("/exportDashboard/exBtbVolmeDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExpOrdBtbVolDetailsData>) => {
                        console.log("Order Volume open Response:", pageResponse);
                        this.expOrdBtbVolumeDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcAmount: this.formatAmount(Number(item.lcAmount)),
                            lcEnAmt: this.formatAmount(Number(item.lcEnAmt)),
                            lcRdAmt: this.formatAmount(Number(item.lcRdAmt)),
                            lcTotalAmount: this.formatAmount(Number(item.lcTotalAmount)),
                        }));
                        this.paginationState.btbVolume.totalItems = pageResponse.totalElements;
                        this.paginationState.btbVolume.pageSize = pageResponse.pageSize;
                        this.paginationState.btbVolume.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch BTB open details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.btbVolume.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }


    /**
     * Opens the "BTB OS Volume Open" detail view, loads data, and configures the table.
     */
    ExpOrdBTBOsOpenDialog() {
        this.currentDetailView = "btbOsAmount";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[200px]" },
            { key: "btbRefNum", label: "LC Ref. NO", cssClass: "min-w-[150px] w-[150px]" },
            { key: "exOrRefNum", label: "LC Serial", cssClass: "min-w-[150px] w-[150px]" },
            { key: "custNum", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
            { key: "lcCurr", label: "Currency", cssClass: "min-w-[90px] w-[150px]" },
            { key: "lcAmount", label: "LC Open Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcAmdEn", label: "LC En. Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcAmdRd", label: "LC Rd. Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcMnRv", label: "LC Mn. Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcCan", label: "LC can. Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcAccBill", label: "Acc Bill Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcPay", label: "LC Pay. Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "totalOsAmount", label: "Total OS Amount", cssClass: "min-w-[150px] w-[150px]" },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]" },
        ];

        this.paginationState.btbOsAmount.currentPage = 0;

        this.loadExpOrdBTBOsOpenDetails()
            .then(() => {
                console.log("Data loaded:", this.expOrdBTbOsAmtDetails);

                if (this.expOrdBTbOsAmtDetails && this.expOrdBTbOsAmtDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View BTB OS Amount Details",
                        columns: columns,
                        tableData: this.expOrdBTbOsAmtDetails,
                        totalItems: this.paginationState.btbOsAmount.totalItems,
                        pageSize: this.paginationState.btbOsAmount.pageSize,
                        currentPage: this.paginationState.btbOsAmount.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View BTB OS Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.btbOsAmount.pageSize,
                        currentPage: this.paginationState.btbOsAmount.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View BTB OS Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.btbOsAmount.pageSize,
                    currentPage: this.paginationState.btbOsAmount.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated BTB Volume open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExpOrdBTBOsOpenDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.btbOsAmount;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ExpOrdBtbOsDetailsData>("/exportDashboard/exBtbOsDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExpOrdBtbOsDetailsData>) => {
                        console.log("Order Volume open Response:", pageResponse);
                        this.expOrdBTbOsAmtDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcAmount: this.formatAmount(Number(item.lcAmount)),
                            lcAmdEn: this.formatAmount(Number(item.lcAmdEn)),
                            lcAmdRd: this.formatAmount(Number(item.lcAmdRd)),
                            lcMnRv: this.formatAmount(Number(item.lcMnRv)),
                            lcCan : this.formatAmount(Number(item.lcCan)),
                            lcAccBill: this.formatAmount(Number(item.lcAccBill)),
                            lcPay: this.formatAmount(Number(item.lcPay)),
                            totalOsAmount: this.formatAmount(Number(item.totalOsAmount)),
                        }));
                        this.paginationState.btbOsAmount.totalItems = pageResponse.totalElements;
                        this.paginationState.btbOsAmount.pageSize = pageResponse.pageSize;
                        this.paginationState.btbOsAmount.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch BTB OS details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.btbOsAmount.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

     /**
     * Opens the "BTB bill amount Open" detail view, loads data, and configures the table.
     */
    ExpOrdBtbBillOpenDialog() {
        this.currentDetailView = "btbBillAmount";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[200px]" },
            { key: "lcBillRefNo", label: "Bill Ref.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcRefNo", label: "LC Ref.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "exOrRefNum", label: "Exp/Ord Ref.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "custNum", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
            { key: "billCurr", label: "Currency", cssClass: "min-w-[90px] w-[150px]" },
            { key: "billAmount", label: "LC Open Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]" },
        ];

        this.paginationState.btbBillAmount.currentPage = 0;

        this.loadExpOrdBtbBillOpenDetails()
            .then(() => {
                console.log("Data loaded:", this.expOrdBtbBillDetails);

                if (this.expOrdBtbBillDetails && this.expOrdBtbBillDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View BTB Bill Amount Details",
                        columns: columns,
                        tableData: this.expOrdBtbBillDetails,
                        totalItems: this.paginationState.btbBillAmount.totalItems,
                        pageSize: this.paginationState.btbBillAmount.pageSize,
                        currentPage: this.paginationState.btbBillAmount.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View BTB Bill Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.btbBillAmount.pageSize,
                        currentPage: this.paginationState.btbBillAmount.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View BTB Bill Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.btbBillAmount.pageSize,
                    currentPage: this.paginationState.btbBillAmount.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated BTB Bill amount open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExpOrdBtbBillOpenDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.btbBillAmount;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ExpOrdBTbBillDetailsData>("/exportDashboard/exBtbBillDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExpOrdBTbBillDetailsData>) => {
                        console.log("BTB Bill Amount open Response:", pageResponse);
                        this.expOrdBtbBillDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            billAmount: this.formatAmount(Number(item.billAmount))
                        }));
                        this.paginationState.btbBillAmount.totalItems = pageResponse.totalElements;
                        this.paginationState.btbBillAmount.pageSize = pageResponse.pageSize;
                        this.paginationState.btbBillAmount.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch BTB Bill details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.btbBillAmount.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }


   /**
     * Opens the "BTB bill payment amount Open" detail view, loads data, and configures the table.
     */
    ExpOrdBtbBillPayOpenDialog() {
        this.currentDetailView = "btbPayAmount";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[200px]" },
            { key: "billRefNo", label: "Bill Ref.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "paySerial", label: "Pay. Serial", cssClass: "min-w-[90px] w-[200px]" },
            { key: "lcRefNo", label: "LC Ref.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "exOrRefNum", label: "Exp/Ord Ref.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "custNum", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
            { key: "billCurr", label: "Currency", cssClass: "min-w-[90px] w-[150px]" },
            { key: "billPayAmt", label: "LC Open Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "tranBatchNo", label: "Batch Num.", cssClass: "min-w-[100px] w-[220px]" },
            { key: "tranDate", label: "Tran Date", cssClass: "min-w-[120px] w-[220px]" },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]" },
        ];

        this.paginationState.btbPayAmount.currentPage = 0;

        this.loadExpOrdBtbBillPayDetails()
            .then(() => {
                console.log("Data loaded:", this.expOrdBtbPayDetails);

                if (this.expOrdBtbPayDetails && this.expOrdBtbPayDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View BTB Bill Amount Details",
                        columns: columns,
                        tableData: this.expOrdBtbPayDetails,
                        totalItems: this.paginationState.btbPayAmount.totalItems,
                        pageSize: this.paginationState.btbPayAmount.pageSize,
                        currentPage: this.paginationState.btbPayAmount.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View BTB Bill Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.btbPayAmount.pageSize,
                        currentPage: this.paginationState.btbPayAmount.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View BTB Bill Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.btbPayAmount.pageSize,
                    currentPage: this.paginationState.btbPayAmount.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated BTB Bill payment amount open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExpOrdBtbBillPayDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.btbPayAmount;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ExpOrdBtbPayDetailsData>("/exportDashboard/exBtbPayDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExpOrdBtbPayDetailsData>) => {
                        console.log("BTB Bill Amount open Response:", pageResponse);
                        this.expOrdBtbPayDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            billPayAmt: this.formatAmount(Number(item.billPayAmt))
                        }));
                        this.paginationState.btbPayAmount.totalItems = pageResponse.totalElements;
                        this.paginationState.btbPayAmount.pageSize = pageResponse.pageSize;
                        this.paginationState.btbPayAmount.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch BTB Bill details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.btbPayAmount.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

     /**
     * Opens the "BTB PAD payment amount Open" detail view, loads data, and configures the table.
     */
    ExpOrdBtbPadAmtOpenDialog() {
        this.currentDetailView = "btbPadAmount";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[200px]" },
            { key: "exOrRefNum", label: "Exp/Ord Ref.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcRefNo", label: "LC Ref.", cssClass: "min-w-[150px] w-[150px]" },
            
            { key: "billRefNo", label: "Bill Ref.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "billPaySl", label: "Pay. Serial", cssClass: "min-w-[90px] w-[200px]" },
            { key: "billPartFinal", label: "Part/Final", cssClass: "min-w-[90px] w-[200px]" },
            { key: "billCustNo", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
            { key: "billCurr", label: "Currency", cssClass: "min-w-[90px] w-[150px]" },
            { key: "billPayAmt", label: "Bill Pay Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "billPayBaseAmt", label: "Base Amount", cssClass: "min-w-[150px] w-[150px]" },
            { key: "billPadAccNo", label: "Account Num.", cssClass: "min-w-[140px] w-[150px]" },
            { key: "billPadAmt", label: "PAD Amount", cssClass: "min-w-[150px] w-[150px]" },
            { key: "tranBatchNo", label: "Batch Num.", cssClass: "min-w-[100px] w-[220px]" },
            { key: "tranDate", label: "Tran Date", cssClass: "min-w-[120px] w-[220px]" },
            { key: "billEntdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "billEntdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]" },
        ];

        this.paginationState.btbPadAmount.currentPage = 0;

        this.loadExpOrdBtbPaDDetails()
            .then(() => {
                console.log("Data loaded:", this.expOrdPadDetails);

                if (this.expOrdPadDetails && this.expOrdPadDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View BTB PAD Amount Details",
                        columns: columns,
                        tableData: this.expOrdPadDetails,
                        totalItems: this.paginationState.btbPadAmount.totalItems,
                        pageSize: this.paginationState.btbPadAmount.pageSize,
                        currentPage: this.paginationState.btbPadAmount.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View BTB PAD Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.btbPadAmount.pageSize,
                        currentPage: this.paginationState.btbPadAmount.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View BTB PAD Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.btbPadAmount.pageSize,
                    currentPage: this.paginationState.btbPadAmount.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated BTB PAD payment amount open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExpOrdBtbPaDDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.btbPadAmount;

        return new Promise((resolve, reject) =>{
            this.dashboardService
                .getPagedData<ExpOrdBtbPadDetailsData>("/exportDashboard/exBtbPadDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExpOrdBtbPadDetailsData>) => {
                        console.log("BTB PAD Amount open Response:", pageResponse);
                        this.expOrdPadDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            billPayAmt: this.formatAmount(Number(item.billPayAmt)),
                            billPayBaseAmt : this.formatAmount(Number(item.billPayBaseAmt)),
                            billPadAmt : this.formatAmount(Number(item.billPadAmt))
                        }));
                        this.paginationState.btbPadAmount.totalItems = pageResponse.totalElements;
                        this.paginationState.btbPadAmount.pageSize = pageResponse.pageSize;
                        this.paginationState.btbPadAmount.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch BTB PAD details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.btbPadAmount.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
            });
    }

     /**
     * Opens the "BTB PAD OS payment amount Open" detail view, loads data, and configures the table.
     */
    ExpOrdBtbPadOsAmtOpenDialog() {
        this.currentDetailView = "btbPadOsAmount";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            { key: "lcBrnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[200px]" },
            { key: "exOrRefNum", label: "Exp/Ord Ref.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcRefNo", label: "LC Ref.", cssClass: "min-w-[150px] w-[150px]" },
            
            { key: "billRefNo", label: "Bill Ref.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "billPaySl", label: "Pay. Serial", cssClass: "min-w-[90px] w-[200px]" },
            { key: "billCustNo", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
            { key: "billCurr", label: "Currency", cssClass: "min-w-[90px] w-[150px]" },
            { key: "billPayAmt", label: "Bill Pay Amt.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "billPayBaseAmt", label: "Base Amount", cssClass: "min-w-[150px] w-[150px]" },
            { key: "billPadAcc", label: "Account Num.", cssClass: "min-w-[140px] w-[150px]" },
            { key: "billPadAmt", label: "PAD Amount", cssClass: "min-w-[150px] w-[150px]" },
            { key: "billPadOsAmt", label: "PAD Amount", cssClass: "min-w-[150px] w-[150px]" },
            { key: "tranBatchNo", label: "Batch Num.", cssClass: "min-w-[100px] w-[220px]" },
            { key: "tranDate", label: "Tran Date", cssClass: "min-w-[120px] w-[220px]" },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]" },
        ];

        this.paginationState.btbPadOsAmount.currentPage = 0;

        this.loadExpOrdBtbPadOsDetails()
            .then(() => {
                console.log("Data loaded:", this.expOrdPadOsDetails);

                if (this.expOrdPadOsDetails && this.expOrdPadOsDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View BTB PAD O/S Amount Details",
                        columns: columns,
                        tableData: this.expOrdPadOsDetails,
                        totalItems: this.paginationState.btbPadOsAmount.totalItems,
                        pageSize: this.paginationState.btbPadOsAmount.pageSize,
                        currentPage: this.paginationState.btbPadOsAmount.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View BTB PAD O/S Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.btbPadOsAmount.pageSize,
                        currentPage: this.paginationState.btbPadOsAmount.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View BTB PAD O/S Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.btbPadOsAmount.pageSize,
                    currentPage: this.paginationState.btbPadOsAmount.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated BTB PAD OS payment amount open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExpOrdBtbPadOsDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.btbPadOsAmount;

        return new Promise((resolve, reject) =>{
            this.dashboardService
                .getPagedData<ExpOrdBtbPadOsDetailsData>("/exportDashboard/exBtbPadOsDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExpOrdBtbPadOsDetailsData>) => {
                        console.log("BTB PAD O/S Amount open Response:", pageResponse);
                        this.expOrdPadOsDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            billPayAmt: this.formatAmount(Number(item.billPayAmt)),
                            billPayBaseAmt : this.formatAmount(Number(item.billPayBaseAmt)),
                            billPadAmt : this.formatAmount(Number(item.billPadAmt)),
                            billPadOsAmt : this.formatAmount(Number(item.billPadOsAmt))
                        }));
                        this.paginationState.btbPadOsAmount.totalItems = pageResponse.totalElements;
                        this.paginationState.btbPadOsAmount.pageSize = pageResponse.pageSize;
                        this.paginationState.btbPadOsAmount.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch BTB PAD O/S details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.btbPadOsAmount.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
            });
    }


     /**
     * Opens the "Exp/Ord PC  amount Open" detail view, loads data, and configures the table.
     */
    ExpOrdPcAmtOpenDialog() {
        this.currentDetailView = "expOrdPcAmount";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[200px]" },
            { key: "exOrRefNum", label: "Exp/Ord Ref.", cssClass: "min-w-[150px] w-[150px]" },
            { key: "pcRefNmber", label: "PC Ref.", cssClass: "min-w-[220px] w-[250px]" },
            { key: "custNum", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
             { key: "lnAccNumber", label: "Account Num.", cssClass: "min-w-[140px] w-[150px]" },
            { key: "pcCurrency", label: "Currency", cssClass: "min-w-[90px] w-[150px]" },
            { key: "pcAmount", label: "PC Amount", cssClass: "min-w-[150px] w-[150px]" },
            { key: "pcRate", label: "Rate", cssClass: "min-w-[100px] w-[150px]" },
            { key: "pcBaseAmount", label: "Base Amount", cssClass: "min-w-[150px] w-[150px]" },
            { key: "tranBatchNo", label: "Batch Num.", cssClass: "min-w-[100px] w-[220px]" },
            { key: "tranDate", label: "Tran Date", cssClass: "min-w-[120px] w-[220px]" },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]" },
        ];

        this.paginationState.expOrdPcAmount.currentPage = 0;

        this.loadExpOrdPcDetails()
            .then(() => {
                console.log("Data loaded:", this.expOrdPcAmtDetails);

                if (this.expOrdPcAmtDetails && this.expOrdPcAmtDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Exp/Ord PC Amount Details",
                        columns: columns,
                        tableData: this.expOrdPcAmtDetails,
                        totalItems: this.paginationState.expOrdPcAmount.totalItems,
                        pageSize: this.paginationState.expOrdPcAmount.pageSize,
                        currentPage: this.paginationState.expOrdPcAmount.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Exp/Ord PC Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.expOrdPcAmount.pageSize,
                        currentPage: this.paginationState.expOrdPcAmount.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Exp/Ord PC Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.expOrdPcAmount.pageSize,
                    currentPage: this.paginationState.expOrdPcAmount.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated exp/ord PC amount open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExpOrdPcDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.expOrdPcAmount;

        return new Promise((resolve, reject) =>{
            this.dashboardService
                .getPagedData<ExpOrdPcAmtDetailsData>("/exportDashboard/exOrPcAmtDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExpOrdPcAmtDetailsData>) => {
                        console.log("Exp/Ord PC Amount open Response:", pageResponse);
                        this.expOrdPcAmtDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            pcAmount: this.formatAmount(Number(item.pcAmount)),
                            pcRate: this.formatAmount(Number(item.pcRate)),
                            pcBaseAmount: this.formatAmount(Number(item.pcBaseAmount))
                        }));
                        this.paginationState.expOrdPcAmount.totalItems = pageResponse.totalElements;
                        this.paginationState.expOrdPcAmount.pageSize = pageResponse.pageSize;
                        this.paginationState.expOrdPcAmount.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Exp/Ord PC details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.expOrdPcAmount.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
            });
    }

    /**
     * Opens the "Exp/Ord Bill  amount Open" detail view, loads data, and configures the table.
     */
    ExpOrdBillAmtOpenDialog() {
        this.currentDetailView = "expOrdBillAmt";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[200px]" },
            { key: "exOrRefNum", label: "Exp/Ord Ref.", cssClass: "min-w-[150px] w-[200px]" },
            { key: "billRefNo", label: "Bill Ref.", cssClass: "min-w-[150px] w-[200px]" },
            { key: "custNo", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
            { key: "billCurr", label: "Currency", cssClass: "min-w-[90px] w-[150px]" },
            { key: "billAmount", label: "Bill Amount", cssClass: "min-w-[150px] w-[150px]" },
            { key: "billConvRate", label: "Rate", cssClass: "min-w-[100px] w-[150px]" },
            { key: "billAmountBase", label: "Base Amount", cssClass: "min-w-[150px] w-[150px]" },
            { key: "tranBatchNo", label: "Batch Num.", cssClass: "min-w-[100px] w-[220px]" },
            { key: "tranDate", label: "Tran Date", cssClass: "min-w-[120px] w-[220px]" },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]" },
        ];

        this.paginationState.expOrdBillAmt.currentPage = 0;

        this.loadExpOrdBillDetails()
            .then(() => {
                console.log("Data loaded:", this.expOrdBillAmtDetails);

                if (this.expOrdBillAmtDetails && this.expOrdBillAmtDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Exp/Ord Bill Amount Details",
                        columns: columns,
                        tableData: this.expOrdBillAmtDetails,
                        totalItems: this.paginationState.expOrdBillAmt.totalItems,
                        pageSize: this.paginationState.expOrdBillAmt.pageSize,
                        currentPage: this.paginationState.expOrdBillAmt.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Exp/Ord Bill Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.expOrdBillAmt.pageSize,
                        currentPage: this.paginationState.expOrdBillAmt.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Exp/Ord Bill Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.expOrdBillAmt.pageSize,
                    currentPage: this.paginationState.expOrdBillAmt.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated exp/ord Bill amount open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExpOrdBillDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.expOrdBillAmt;

        return new Promise((resolve, reject) =>{
            this.dashboardService
                .getPagedData<ExpOrdBillAmtDetailsData>("/exportDashboard/exOrBillAmtDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExpOrdBillAmtDetailsData>) => {
                        console.log("Exp/Ord Bill Amount open Response:", pageResponse);
                        this.expOrdBillAmtDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            billAmount: this.formatAmount(Number(item.billAmount)),
                            billConvRate: this.formatAmount(Number(item.billConvRate)),
                            billAmountBase: this.formatAmount(Number(item.billAmountBase))
                        }));
                        this.paginationState.expOrdBillAmt.totalItems = pageResponse.totalElements;
                        this.paginationState.expOrdBillAmt.pageSize = pageResponse.pageSize;
                        this.paginationState.expOrdBillAmt.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Exp/Ord Bill details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.expOrdBillAmt.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
            });
    }


    /**
     * Opens the "Exp/Ord PL  amount Open" detail view, loads data, and configures the table.
     */
    ExpOrdPlAmtOpenDialog() {
        this.currentDetailView = "expOrdPlAmt";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[200px]" },
            { key: "exOrRefNum", label: "Exp/Ord Ref.", cssClass: "min-w-[150px] w-[200px]" },
            { key: "billRefNo", label: "Bill Ref.", cssClass: "min-w-[150px] w-[200px]" },
            { key: "custNum", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
            { key: "plDisbSl", label: "PL Disb. Sl", cssClass: "min-w-[100px] w-[150px]" },
            { key: "billCurr", label: "Bill Curr.", cssClass: "min-w-[100px] w-[150px]" },
            { key: "lnAccNumber", label: "Acc. Number", cssClass: "min-w-[100px] w-[150px]" },
            { key: "loanAmount", label: "Loan Amount", cssClass: "min-w-[150px] w-[250px]" },
            { key: "loanBaseCurr", label: "Base Amount", cssClass: "min-w-[150px] w-[250px]" },
            { key: "loanOsAmt", label: "Loan OS Amt.", cssClass: "min-w-[150px] w-[250px]" },
            { key: "tranBatchNo", label: "Batch Num.", cssClass: "min-w-[100px] w-[220px]" },
            { key: "tranDate", label: "Tran Date", cssClass: "min-w-[120px] w-[220px]" },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]" },
        ];

        this.paginationState.expOrdPlAmt.currentPage = 0;

        this.loadExpOrdPlDetails()
            .then(() => {
                console.log("Data loaded:", this.expOrdPlAmtDetails);

                if (this.expOrdPlAmtDetails && this.expOrdPlAmtDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Exp/Ord PL Amount Details",
                        columns: columns,
                        tableData: this.expOrdPlAmtDetails,
                        totalItems: this.paginationState.expOrdPlAmt.totalItems,
                        pageSize: this.paginationState.expOrdPlAmt.pageSize,
                        currentPage: this.paginationState.expOrdPlAmt.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Exp/Ord PL Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.expOrdPlAmt.pageSize,
                        currentPage: this.paginationState.expOrdPlAmt.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Exp/Ord PL Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.expOrdPlAmt.pageSize,
                    currentPage: this.paginationState.expOrdPlAmt.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated exp/ord PL amount open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExpOrdPlDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.expOrdPlAmt;

        return new Promise((resolve, reject) =>{
            this.dashboardService
                .getPagedData<ExpOrdPlLoanDetailsData>("/exportDashboard/exOrPlAmtDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExpOrdPlLoanDetailsData>) => {
                        console.log("Exp/Ord PL Amount open Response:", pageResponse);
                        this.expOrdPlAmtDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            loanAmount: this.formatAmount(Number(item.loanAmount)),
                            loanBaseCurr: this.formatAmount(Number(item.loanBaseCurr)),
                            loanOsAmt: this.formatAmount(Number(item.loanOsAmt))
                        }));
                        this.paginationState.expOrdPlAmt.totalItems = pageResponse.totalElements;
                        this.paginationState.expOrdPlAmt.pageSize = pageResponse.pageSize;
                        this.paginationState.expOrdPlAmt.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Exp/Ord PL details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.expOrdPlAmt.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
            });
    }

    /**
     * Opens the "Exp/Ord disbursement  amount Open" detail view, loads data, and configures the table.
     */
    ExpOrdDisbAmtOpenDialog() {
        this.currentDetailView = "expOrdDisbAmt";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[200px]" },
            { key: "exOrRefNum", label: "Exp/Ord Ref.", cssClass: "min-w-[150px] w-[200px]" },
            { key: "billRefNo", label: "Bill Ref.", cssClass: "min-w-[150px] w-[200px]" },
           
            { key: "billPaySl", label: "Pay Sl.", cssClass: "min-w-[100px] w-[150px]" },
             { key: "custNum", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
            { key: "billCurr", label: "Bill Curr.", cssClass: "min-w-[100px] w-[150px]" },
            { key: "disbAmount", label: "Disb. Amount", cssClass: "min-w-[150px] w-[250px]" },
           
            { key: "tranBatchNo", label: "Batch Num.", cssClass: "min-w-[100px] w-[220px]" },
            { key: "tranDate", label: "Tran Date", cssClass: "min-w-[120px] w-[220px]" },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]" },
        ];

        this.paginationState.expOrdDisbAmt.currentPage = 0;

        this.loadExpOrdDisbDetails()
            .then(() => {
                console.log("Data loaded:", this.expOrdDisbAmtDetails);

                if (this.expOrdDisbAmtDetails && this.expOrdDisbAmtDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Exp/Ord Disb. Amount Details",
                        columns: columns,
                        tableData: this.expOrdDisbAmtDetails,
                        totalItems: this.paginationState.expOrdDisbAmt.totalItems,
                        pageSize: this.paginationState.expOrdDisbAmt.pageSize,
                        currentPage: this.paginationState.expOrdDisbAmt.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Exp/Ord Disb. Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.expOrdDisbAmt.pageSize,
                        currentPage: this.paginationState.expOrdDisbAmt.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Exp/Ord Disb. Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.expOrdDisbAmt.pageSize,
                    currentPage: this.paginationState.expOrdDisbAmt.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated exp/ord Disbursement amount open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExpOrdDisbDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.expOrdDisbAmt;

        return new Promise((resolve, reject) =>{
            this.dashboardService
                .getPagedData<ExpOrdDisbAmtDetailsData>("/exportDashboard/exOrDisbAmtDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExpOrdDisbAmtDetailsData>) => {
                        console.log("Exp/Ord Disbursement Amount open Response:", pageResponse);
                        this.expOrdDisbAmtDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            disbAmount: this.formatAmount(Number(item.disbAmount))
                        }));
                        this.paginationState.expOrdDisbAmt.totalItems = pageResponse.totalElements;
                        this.paginationState.expOrdDisbAmt.pageSize = pageResponse.pageSize;
                        this.paginationState.expOrdDisbAmt.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Exp/Ord Disb. details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.expOrdDisbAmt.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
            });
    }


    /**
     * Opens the "Exp/Ord EDF  amount Open" detail view, loads data, and configures the table.
     */
    ExpOrdEdfRcAmtOpenDialog() {
        this.currentDetailView = "expOrdEdfRc";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[50px] w-[150px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[200px]" },
            { key: "lcRefNo", label: "LC Ref.", cssClass: "min-w-[150px] w-[200px]" },
            { key: "billRefNo", label: "Bill Ref.", cssClass: "min-w-[150px] w-[200px]" },
           
            { key: "paySl", label: "Pay Sl.", cssClass: "min-w-[100px] w-[150px]" },
             { key: "edfRcDate", label: "Received Date", cssClass: "min-w-[120px] w-[150px]" },
            { key: "rcDaySl", label: "Day Sl", cssClass: "min-w-[90px] w-[150px]" },
            { key: "edfRcAmtCurr", label: "Received Curr", cssClass: "min-w-[90px] w-[150px]" },
            { key: "edfRcAmt", label: "Amount", cssClass: "min-w-[150px] w-[250px]" },
           { key: "edfOsAmt", label: "O/S Amount", cssClass: "min-w-[150px] w-[250px]" },
            { key: "tranBatchNo", label: "Batch Num.", cssClass: "min-w-[100px] w-[220px]" },
            { key: "tranDate", label: "Tran Date", cssClass: "min-w-[120px] w-[220px]" },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]" },
        ];

        this.paginationState.expOrdEdfRc.currentPage = 0;

        this.loadExpOrdEDFDetails()
            .then(() => {
                console.log("Data loaded:", this.expordEdfRcDetails);

                if (this.expordEdfRcDetails && this.expordEdfRcDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Exp/Ord EDF Amount Details",
                        columns: columns,
                        tableData: this.expordEdfRcDetails,
                        totalItems: this.paginationState.expOrdEdfRc.totalItems,
                        pageSize: this.paginationState.expOrdEdfRc.pageSize,
                        currentPage: this.paginationState.expOrdEdfRc.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Exp/Ord EDF Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.expOrdEdfRc.pageSize,
                        currentPage: this.paginationState.expOrdEdfRc.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Exp/Ord EDF Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.expOrdEdfRc.pageSize,
                    currentPage: this.paginationState.expOrdEdfRc.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated exp/ord EDF amount open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadExpOrdEDFDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.expOrdEdfRc;

        return new Promise((resolve, reject) =>{
            this.dashboardService
                .getPagedData<ExpOrdEdfRcDetailsData>("/exportDashboard/exOrEdfAmtDtls", {
                    year: this.exportForm.get("year")?.value || "",
                    branchCode: this.exportForm.get("branchCode")?.value || "",
                    currency: this.exportForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ExpOrdEdfRcDetailsData>) => {
                        console.log("Exp/Ord EDF Amount open Response:", pageResponse);
                        this.expordEdfRcDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            edfRcAmt: this.formatAmount(Number(item.edfRcAmt)),
                            edfOsAmt: this.formatAmount(Number(item.edfOsAmt))
                        }));
                        this.paginationState.expOrdEdfRc.totalItems = pageResponse.totalElements;
                        this.paginationState.expOrdEdfRc.pageSize = pageResponse.pageSize;
                        this.paginationState.expOrdEdfRc.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Exp/Ord Edf. details:", err);
                        this.expOpenDetails = [];
                        this.paginationState.expOrdEdfRc.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
            });
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
     * Updates the current detail dialog data based on the active view type
     * to reflect the latest table data and pagination state.
     */
    private updateLcDialogData() {
        if (this.currentDetailView === "exportOpen" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expOpenDetails,
                totalItems: this.paginationState.exportOpen.totalItems,
                pageSize: this.paginationState.exportOpen.pageSize,
                currentPage: this.paginationState.exportOpen.currentPage,
            };
        }
        if (this.currentDetailView === "orderOpen" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.ordOpenDetails,
                totalItems: this.paginationState.orderOpen.totalItems,
                pageSize: this.paginationState.orderOpen.pageSize,
                currentPage: this.paginationState.orderOpen.currentPage,
            };
        }
        if (this.currentDetailView === "btbOpen" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expOrdBtbOpenDetails,
                totalItems: this.paginationState.btbOpen.totalItems,
                pageSize: this.paginationState.btbOpen.pageSize,
                currentPage: this.paginationState.btbOpen.currentPage,
            };
        }
        if (this.currentDetailView === "exportVolume" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expVolumeDetails,
                totalItems: this.paginationState.exportVolume.totalItems,
                pageSize: this.paginationState.exportVolume.pageSize,
                currentPage: this.paginationState.exportVolume.currentPage,
            };
        }
        if (this.currentDetailView === "orderVolume" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.ordVolumeDetails,
                totalItems: this.paginationState.orderVolume.totalItems,
                pageSize: this.paginationState.orderVolume.pageSize,
                currentPage: this.paginationState.orderVolume.currentPage,
            };
        }
        if (this.currentDetailView === "btbVolume" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expOrdBtbVolumeDetails,
                totalItems: this.paginationState.btbVolume.totalItems,
                pageSize: this.paginationState.btbVolume.pageSize,
                currentPage: this.paginationState.btbVolume.currentPage,
            };
        }
        if (this.currentDetailView === "btbOsAmount" && this.viewMode === "details") {  
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expOrdBTbOsAmtDetails,
                totalItems: this.paginationState.btbOsAmount.totalItems,
                pageSize: this.paginationState.btbOsAmount.pageSize,
                currentPage: this.paginationState.btbOsAmount.currentPage,
            };
        }
        if (this.currentDetailView === "btbBillAmount" && this.viewMode === "details") {  
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expOrdBtbBillDetails,
                totalItems: this.paginationState.btbBillAmount.totalItems,
                pageSize: this.paginationState.btbBillAmount.pageSize,
                currentPage: this.paginationState.btbBillAmount.currentPage,
            };
        }
        if (this.currentDetailView === "btbPayAmount" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expOrdBtbPayDetails,
                totalItems: this.paginationState.btbPayAmount.totalItems,
                pageSize: this.paginationState.btbPayAmount.pageSize,
                currentPage: this.paginationState.btbPayAmount.currentPage,
            };
        }
        if (this.currentDetailView === "btbPadAmount" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expOrdPadDetails,
                totalItems: this.paginationState.btbPadAmount.totalItems,
                pageSize: this.paginationState.btbPadAmount.pageSize,
                currentPage: this.paginationState.btbPadAmount.currentPage,
            };
        }
        if (this.currentDetailView === "btbPadOsAmount" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expOrdPadOsDetails,
                totalItems: this.paginationState.btbPadOsAmount.totalItems,
                pageSize: this.paginationState.btbPadOsAmount.pageSize,
                currentPage: this.paginationState.btbPadOsAmount.currentPage,
            };
        }
        if (this.currentDetailView === "expOrdPcAmount" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expOrdPcAmtDetails,
                totalItems: this.paginationState.expOrdPcAmount.totalItems,
                pageSize: this.paginationState.expOrdPcAmount.pageSize,
                currentPage: this.paginationState.expOrdPcAmount.currentPage,
            };
        }
        if (this.currentDetailView === "expOrdBillAmt" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expOrdBillAmtDetails,
                totalItems: this.paginationState.expOrdBillAmt.totalItems,
                pageSize: this.paginationState.expOrdBillAmt.pageSize,
                currentPage: this.paginationState.expOrdBillAmt.currentPage,
            };
        }
        if (this.currentDetailView === "expOrdPlAmt" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expOrdPlAmtDetails,
                totalItems: this.paginationState.expOrdPlAmt.totalItems,
                pageSize: this.paginationState.expOrdPlAmt.pageSize,
                currentPage: this.paginationState.expOrdPlAmt.currentPage,
            };
        }
        if (this.currentDetailView === "expOrdDisbAmt" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expOrdDisbAmtDetails,
                totalItems: this.paginationState.expOrdDisbAmt.totalItems,
                pageSize: this.paginationState.expOrdDisbAmt.pageSize,
                currentPage: this.paginationState.expOrdDisbAmt.currentPage,
            };
        }
        if (this.currentDetailView === "expOrdEdfRc" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.expordEdfRcDetails,
                totalItems: this.paginationState.expOrdEdfRc.totalItems,
                pageSize: this.paginationState.expOrdEdfRc.pageSize,
                currentPage: this.paginationState.expOrdEdfRc.currentPage,
            };
        }

    }

    /**
     * Handles pagination events and reloads the appropriate data set
     * based on the currently active detail view.
     * @param event The pagination event containing page index and size.
     */
    onPageChangeHandler(event: PageEvent) {
        if (this.currentDetailView === "exportOpen") {
            this.paginationState.exportOpen.currentPage = event.pageIndex;
            this.paginationState.exportOpen.pageSize = event.pageSize;
            this.loadExportOpenDetails();
        }
        if (this.currentDetailView === "orderOpen") {
            this.paginationState.orderOpen.currentPage = event.pageIndex;
            this.paginationState.orderOpen.pageSize = event.pageSize;
            this.loadOrderOpenDetails();
        }
        if (this.currentDetailView === "btbOpen") {
            this.paginationState.btbOpen.currentPage = event.pageIndex;
            this.paginationState.btbOpen.pageSize = event.pageSize;
            this.loadBTBOpenDetails();
        }
        if (this.currentDetailView === "exportVolume") {
            this.paginationState.exportVolume.currentPage = event.pageIndex;
            this.paginationState.exportVolume.pageSize = event.pageSize;
            this.loadExpVolOpenDetails();
        }
        if (this.currentDetailView === "orderVolume") {
            this.paginationState.orderVolume.currentPage = event.pageIndex;
            this.paginationState.orderVolume.pageSize = event.pageSize;
            this.loadOrdVolOpenDetails();
        }
        if (this.currentDetailView === "btbVolume") {
            this.paginationState.btbVolume.currentPage = event.pageIndex;
            this.paginationState.btbVolume.pageSize = event.pageSize;
            this.loadExpOrdBTBVolOpenDetails();
        }
        if (this.currentDetailView === "btbOsAmount") {
            this.paginationState.btbOsAmount.currentPage = event.pageIndex;
            this.paginationState.btbOsAmount.pageSize = event.pageSize;
            this.loadExpOrdBTBOsOpenDetails();
        }
        if (this.currentDetailView === "btbBillAmount") { 
            this.paginationState.btbBillAmount.currentPage = event.pageIndex;
            this.paginationState.btbBillAmount.pageSize = event.pageSize;
            this.loadExpOrdBtbBillOpenDetails();
        }
        if (this.currentDetailView === "btbPayAmount") { 
            this.paginationState.btbPayAmount.currentPage = event.pageIndex;
            this.paginationState.btbPayAmount.pageSize = event.pageSize;
            this.loadExpOrdBtbBillPayDetails();
        }
        if (this.currentDetailView === "btbPadAmount") { 
            this.paginationState.btbPadAmount.currentPage = event.pageIndex;
            this.paginationState.btbPadAmount.pageSize = event.pageSize;
            this.loadExpOrdBtbPaDDetails();
        }
        if (this.currentDetailView === "btbPadOsAmount") { 
            this.paginationState.btbPadOsAmount.currentPage = event.pageIndex;
            this.paginationState.btbPadOsAmount.pageSize = event.pageSize;
            this.loadExpOrdBtbPadOsDetails();
        }
        if (this.currentDetailView === "expOrdPcAmount") { 
            this.paginationState.expOrdPcAmount.currentPage = event.pageIndex;
            this.paginationState.expOrdPcAmount.pageSize = event.pageSize;
            this.loadExpOrdPcDetails();
        }
        if (this.currentDetailView === "expOrdBillAmt") { 
            this.paginationState.expOrdBillAmt.currentPage = event.pageIndex;
            this.paginationState.expOrdBillAmt.pageSize = event.pageSize;
            this.loadExpOrdBillDetails();
        }
        if (this.currentDetailView === "expOrdPlAmt") { 
            this.paginationState.expOrdPlAmt.currentPage = event.pageIndex;
            this.paginationState.expOrdPlAmt.pageSize = event.pageSize;
            this.loadExpOrdPlDetails();
        }
        if (this.currentDetailView === "expOrdDisbAmt") { 
            this.paginationState.expOrdDisbAmt.currentPage = event.pageIndex;
            this.paginationState.expOrdDisbAmt.pageSize = event.pageSize;
            this.loadExpOrdDisbDetails();
        }
        if (this.currentDetailView === "expOrdEdfRc") { 
            this.paginationState.expOrdEdfRc.currentPage = event.pageIndex;
            this.paginationState.expOrdEdfRc.pageSize = event.pageSize;
            this.loadExpOrdEDFDetails();
        }
        
    }
    private formatAmount(value: number | null | undefined): string {
        if (value === null || value === undefined) return "0.00";
        return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}
