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
import { ImportSummaryData } from "../../shared/models/import/ImportSummaryData";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Route, Router } from "@angular/router";
import { ImportLcOpenDetailsData } from "../../shared/models/import/ImportLcOpenDetailsData";
import { DynamicTableDialogComponent } from "../../component/dynamic-table-dialog/dynamic-table-dialog.component";
import { MatIcon } from "@angular/material/icon";
import { ImportPndingLcDetailsData, PendingLcPageResponse } from "../../shared/models/import/ImportPndingLcDetailsData";
import { ImportLcTotalAmountData } from "../../shared/models/import/ImportLcTotalAmountData";
import { PageResponse } from "../../shared/interface/PageResponse";
import { ImportBillAmtDetailsData } from "../../shared/models/import/ImportBillAmtDetailsData";
import { ImportLcOsAmtDetailsData } from "../../shared/models/import/ImportLcOsAmtDetailsData";
import { ImportPayAmtDetailsData } from "../../shared/models/import/ImportPayAmtDetailsData";
import { ImportPayPadAmtDetailsData } from "../../shared/models/import/ImportPayPadAmtDetailsData";
import { ImportPayPadOsDetailsData } from "../../shared/models/import/ImportPayPadOsDetailsData";
import { ImportCommChgDetailsData } from "../../shared/models/import/ImportCommChgDetailsData";
import { ImportBillAccAmtDetailsData } from "../../shared/models/import/ImportBillAccAmtDetailsData";
import { ImportPayChgAmtDetailsData } from "../../shared/models/import/ImportPayChgAmtDetailsData";
import { MatButtonModule } from "@angular/material/button";
import { DashboardCardComponent } from "../../component/dashboard-card/dashboard-card.component";
import { ImportOpenCharge } from "../../shared/models/import/ImportOpenCharge.model";
import { ImportLcVatDetailsData } from "../../shared/models/import/ImportLcVatDetailsData";
import { ImportLcTaxDetailsData } from "../../shared/models/import/ImportLcTaxDetailsData";
import { ImportLcOpenDetailsModel } from "../../shared/models/import/importLcOpen-details.model";
import { NgxEchartsDirective } from "ngx-echarts";
import { EChartsOption } from 'echarts';


@Component({
    selector: "app-import-dashboard",
    standalone: true,
    imports: [
        MatCardModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatIcon,
        DynamicTableDialogComponent,
        MatButtonModule,
        DashboardCardComponent,
        NgxEchartsDirective
    ],
    templateUrl: "./import-dashboard.component.html",
    styleUrl: "./import-dashboard.component.css",
    animations: [
         trigger('slideIn', [
            state('cards', style({
                transform: 'translateX(0)',
                opacity: 1
            })),
            state('details', style({
                transform: 'translateX(0)',
                opacity: 1
            })),

            transition('cards => details', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate(
                    '400ms cubic-bezier(0.25, 0, 0, 0)',
                    style({ transform: 'translateX(0)', opacity: 1 })
                )
            ]),

            transition('details => cards', [
                animate(
                    '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                    style({ transform: 'translateX(-100%)', opacity: 0 })
                )
            ]),
        ])
    ],
})
export class ImportDashboardComponent {
    viewMode: "cards" | "details" = "cards";
    currentDetailData: any = null;
    totalPendingLc: string = "0";
    selectedYear: number = new Date().getFullYear();
    tempSelectedYear: number = 2024;
    selectCurrencyCode: string = "";
    showBranchCodeErrors: boolean = false;
    showCurrencyErrors: boolean = false;
    http = inject(HttpClient);
    years: number[] = [];
    barChartOption!: EChartsOption;
    importStatusPieChartOption!: EChartsOption;

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

    /**chart   */
    private buildImportStatusChartOption(): EChartsOption {
        const s = this.totalImportLcSummary;

        const totalLcOpen = this.parseShortAmount(s.importLcOpen);
        const totalPendingLc = this.parseShortAmount(s.impPendingLc);
        return {
            color: ['#3b82f6', '#fca5a5'],
            title: { text: 'Import Status Overview', left: 'center' },
            tooltip: { trigger: 'item' },
            legend: {
                orient: 'horizontal',
                bottom: '10%',
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: '#374151',
                    fontWeight: 500  // <-- number
                }
            },
            series: [
                {
                    name: 'Status',
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '40%'],
                    data: [
                        { value: totalLcOpen, name: 'Total LC Open' },
                        { value: totalPendingLc, name: 'Total Pending LC' }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                    
                }

            ]
            
        };
    }

    
    paymentChartOption: EChartsOption = {
        title: { text: 'Payment Status Overview', left: 'center' },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '15%',
            left: 'center'
        },
        series: [
            {
                name: 'Status',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '70%'],
                // adjust the start and end angle
                startAngle: 180,
                endAngle: 360,
                data: [
                    { value: 1048, name: 'Payment' },
                    { value: 735, name: 'PAD Payment' },
                ]
            }
        ]
    };

    private  buildBarChartOption(): EChartsOption {
        const s = this.totalImportLcSummary;

        const totalTradeVolume = this.parseShortAmount(s.importAmount);
        const totalBillAmount = this.parseShortAmount(s.importBillAmt);
        const totalPaymentAmount = this.parseShortAmount(s.importPayment);
        const outstandingLiab = this.parseShortAmount(s.ImportOsLiab);
        return {
            title: { text: 'Import Status Overview', left: 'center' },
            dataset: {
                source: [
                    ['score', 'amount', 'product'],
                    [89.3, totalTradeVolume, 'Total Trade Volume'],
                    [57.1, totalBillAmount, 'Total Bill Amount'],
                    [74.4, totalPaymentAmount, 'Total Payment Amount'],
                    [50.1, outstandingLiab, 'Outstanding Liability'],
                ]
            },
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    const amount = params.value[1];
                    return `${params.value[2]}<br/>Amount: $ ${amount.toLocaleString()}`;
                }
            },
            grid: { containLabel: true },

            // >>> xAxis updated <<<
            xAxis: {
                type: 'value',
                min: 0,               // start 0
                max: 2000000,         // 20L = 2,000,000
                interval: 200000,     // 2L gap (optional)

                axisLabel: {
                    formatter: (value: number) => {
                        const inLakh = value / 100000; // convert to L
                        return '$' + inLakh + 'L';
                    }
                }
            },

            yAxis: { type: 'category' },

            series: [
                {
                    name: 'status',
                    type: 'bar',
                    encode: {
                        x: 'amount',
                        y: 'product'
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: (p: any) => '$ ' + p.value[1].toLocaleString()
                    }
                }
            ],
            emphasis: {
                focus: 'self',        // hover korle oi bar ta highlight
                scale: true,
                itemStyle: {
                    shadowBlur: 15,
                    shadowColor: 'rgba(0,0,0,0.3)',
                    borderColor: '#1976d2',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: (p: any) => '$ ' + p.value[1].toLocaleString(),
                    position: 'right'
                }
            }
        };
    }

    



    /** Reactive form group for managing export form inputs (year and currency). */
    importForm: FormGroup = new FormGroup({
        year: new FormControl(this.selectedYear, [Validators.required]),
        branchCode: new FormControl("", [Validators.required, Validators.pattern(/^[0-9]+$/)]),
        currencyCode: new FormControl(this.selectCurrencyCode, [Validators.required, Validators.maxLength(3), Validators.pattern(/^[A-Za-z]+$/)]),
        search: new FormControl(""),
    });

    /** Reference to the year select input field for initial focus. */
    @ViewChild("yearSelect") yearSelect!: ElementRef<HTMLInputElement>;

    totalImportLcSummary: ImportSummaryData = {
        importPadOs: "0.0",
        ImportOsLiab: "0.0",
        impAccChgAmount: "0.0",
        impPendingLc: "0",
        impPayChgAmount: "0.0",
        impCommAmount: "0.0",
        importPayment: "0.0",
        impSwftChgAmount: "0.0",
        importAmount: "0.0",
        importLcOpen: "0",
        importVatAmount: "0.0",
        importTaxAmount: "0.0",
        importPadAmt: "0.0",
        importBillAmt: "0.0",
        importOpChg: "0.0",
    };

    lcOpenDetails: ImportLcOpenDetailsModel[] = [];
    pendingLcDetails: ImportPndingLcDetailsData[] = [];
    importLcAmountDetails: ImportLcTotalAmountData[] = [];
    importBillAmountDetails: ImportBillAmtDetailsData[] = [];
    importOsAmtDetails: ImportLcOsAmtDetailsData[] = [];
    importPayAmtDetails: ImportPayAmtDetailsData[] = [];
    importPayPadAmtDetails: ImportPayPadAmtDetailsData[] = [];
    importPayPadOsDetails: ImportPayPadOsDetailsData[] = [];
    importCommChgDetails: ImportCommChgDetailsData[] = [];
    importBillAccAmtDetails: ImportBillAccAmtDetailsData[] = [];
    importPayChgAmtDetails: ImportPayChgAmtDetailsData[] = [];
    importOpenChargeDetails: ImportOpenCharge[] = [];
    importLcVatDetails: ImportLcVatDetailsData[] = [];
    importLcTaxDetails: ImportLcTaxDetailsData[] = [];

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

    constructor(private dashboardService: DashboardDataService, private dialog: MatDialog, private cdr: ChangeDetectorRef, private el: ElementRef, private router: Router) { }

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

    /**
     * Focuses the year select input field after the view has been initialized.
     */
    ngAfterViewInit() {
        setTimeout(() => {
            this.yearSelect?.nativeElement.focus();
        }, 0);
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
     * sort amount to full amount conversion
     * @param amount short amount string
     * @returns full amount number
     */

    private parseShortAmount(amount: string | number): number {
        if (typeof amount === 'number') return amount;

        if (!amount) return 0;

        const trimmed = amount.trim();

        // Cr / L / K ache naki check
        const crMatch = trimmed.match(/^([\d.]+)\s*Cr$/i);
        const lMatch = trimmed.match(/^([\d.]+)\s*L$/i);
        const kMatch = trimmed.match(/^([\d.]+)\s*K$/i);

        if (crMatch) {
            return parseFloat(crMatch[1]) * 10000000; // Cr -> * 1,00,00,000
        }
        if (lMatch) {
            return parseFloat(lMatch[1]) * 100000;    // L -> * 1,00,000
        }
        if (kMatch) {
            return parseFloat(kMatch[1]) * 1000;      // K -> * 1,000
        }
        const value = parseFloat(trimmed);
        return isNaN(value) ? 0 : value;
    }


    /**
     * Submits the form by triggering data loading from the dashboard service.
     */
    onSubmit() {
        console.log("Form submitted press done ");
        this.loadDashboardData();
    }

    /**
     * Fetches the total import LC summary data based on current form values (year, branch, currency).
     */
    loadDashboardData(): void {
        this.dashboardService
            .fetchTotalImportSummary("/importDashboard/impHistory", {
                year: this.importForm.get("year")?.value || "",
                branchCode: this.importForm.get("branchCode")?.value || "",
                currency: this.importForm.get("currencyCode")?.value || "",
            })
            .subscribe({
                next: (data) => {
                    console.log("Total Import LC Summary:", data);
                    this.totalImportLcSummary = data;
                    
                  this.barChartOption = this.buildBarChartOption();
                  this.importStatusPieChartOption = this.buildImportStatusChartOption();
                },
                error: (err) => {
                    console.error("Failed to fetch import summary:", err);
                },
            });
    }

    /**
     * Updates the selected year from the form control (currently unused for data reload).
     */
    onYearChange(): void {
        this.yearSelect = this.importForm.get("year")?.value;
    }

    /**
     * Converts the currency code input to uppercase on change and updates the form control.
     * @param event The input change event.
     */
    toUppercase(event: Event) {
        const input = event.target as HTMLInputElement;
        const upperValue = input.value.toUpperCase();
        input.value = upperValue;
        this.importForm.get("currencyCode")?.setValue(upperValue, { emitEvent: false });
        this.cdr.detectChanges();
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
     * Opens the "Pending LC" detail view in a dialog-like details mode,
     * loads paginated data, and prepares table configuration.
     */
    pendingLcDialog() {
        this.currentDetailView = "pendingLc";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[70px] w-[150px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[100px] w-[150px]" },
            { key: "lcRefNum", label: "LC Ref. NO", cssClass: "min-w-[150px] w-[200px]", },
            { key: "custNum", label: "Cust. Number", cssClass: "min-w-[150px] w-[150px]" },
            { key: "lcCurr", label: "Currency", cssClass: "min-w-[100px] w-[150px]" },
            { key: "lcAmount", label: "Lc Amount", cssClass: "min-w-[120px] w-[250px]" },
            { key: "totalLcAmount", label: "Total Lc Amount", cssClass: "min-w-[120px] w-[250px]" },
            { key: "totalOsAmount", label: "Total OS Amount", cssClass: "min-w-[120px] w-[250px]" },
            { key: "expiryDate", label: "Expiry Date", cssClass: "min-w-[130px] w-[150px]" },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[100px] w-[150px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[150px] w-[250px]", },
        ];

        this.paginationState.pendingLc.currentPage = 0;

        this.loadImportPendingLcDetails()
            .then(() => {
                console.log("Data loaded:", this.pendingLcDetails);

                if (this.pendingLcDetails && this.pendingLcDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Pending Lc Details",
                        columns: columns,
                        tableData: this.pendingLcDetails,
                        totalItems: this.paginationState.pendingLc.totalItems,
                        pageSize: this.paginationState.pendingLc.pageSize,
                        currentPage: this.paginationState.pendingLc.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Pending Lc Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.pendingLc.pageSize,
                        currentPage: this.paginationState.pendingLc.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading Pending LC data:", error);
                this.currentDetailData = {
                    title: "View Pending Lc Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.pendingLc.pageSize,
                    currentPage: this.paginationState.pendingLc.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated pending LC details from the backend service.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportPendingLcDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.pendingLc;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportPndingLcDetailsData>("/importDashboard/impPenDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportPndingLcDetailsData>) => {
                        console.log("Pending LC Page Response:", pageResponse);

                        this.pendingLcDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcAmount: this.formatAmount(Number(item.lcAmount)),
                            totalLcAmount: this.formatAmount(Number(item.totalLcAmount)),
                            totalOsAmount: this.formatAmount(Number(item.totalOsAmount))
                        }));
                        this.paginationState.pendingLc.totalItems = pageResponse.totalElements;
                        this.paginationState.pendingLc.pageSize = pageResponse.pageSize;
                        this.paginationState.pendingLc.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch pending LC details:", err);
                        this.pendingLcDetails = [];
                        this.paginationState.pendingLc.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Import LC Amount" detail view, loads data, and configures the table.
     */
    importLcAmountDialog() {
        this.currentDetailView = "importAmt";

        const columns = [
            { key: "rn", label: "RN" },
            { key: "lcBrnCode", label: "Branch Code" },
            {
                key: "lcRefNo",
                label: "LC Ref. NO",
                cssClass: "min-w-[150px] w-[150px]",
            },
            { key: "lcCustNum", label: "Cust. Number" },
            { key: "lcCurr", label: "Currency" },
            { key: "lcOpenAmt", label: "Lc Open Amt" },
            { key: "totalAmdEn", label: "Lc En. Amount" },
            { key: "totalAmdRd", label: "Lc Rd. Amount" },
            { key: "totalLcAmt", label: "Lc Amount" },
            { key: "lcEntdBy", label: "Entd. By" },
            {
                key: "lcEntdOn",
                label: "Entd. On",
                cssClass: "min-w-[180px] w-[180px]",
            },
        ];

        this.paginationState.importAmt.currentPage = 0;

        this.loadImportAmountDetails()
            .then(() => {
                console.log("Data loaded:", this.importLcAmountDetails);

                if (this.importLcAmountDetails && this.importLcAmountDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Amount Details",
                        columns: columns,
                        tableData: this.importLcAmountDetails,
                        totalItems: this.paginationState.importAmt.totalItems,
                        pageSize: this.paginationState.importAmt.pageSize,
                        currentPage: this.paginationState.importAmt.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.importAmt.pageSize,
                        currentPage: this.paginationState.importAmt.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.importAmt.pageSize,
                    currentPage: this.paginationState.importAmt.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import LC amount details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportAmountDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.importAmt;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportLcTotalAmountData>("/importDashboard/impLcAmtDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportLcTotalAmountData>) => {
                        console.log("Import Lc Page Response:", pageResponse);
                        this.importLcAmountDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcOpenAmt: this.formatAmount(Number(item.lcOpenAmt)),
                            totalAmdEn: this.formatAmount(Number(item.totalAmdEn)),
                            totalAmdRd: this.formatAmount(Number(item.totalAmdRd)),
                            totalLcAmt: this.formatAmount(Number(item.totalLcAmt))
                        }));
                        //this.importLcAmountDetails = pageResponse.lcList;
                        this.paginationState.importAmt.totalItems = pageResponse.totalElements;
                        this.paginationState.importAmt.pageSize = pageResponse.pageSize;
                        this.paginationState.importAmt.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import Amount details:", err);
                        this.importLcAmountDetails = [];
                        this.paginationState.importAmt.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Import LC Open" detail view, loads data, and configures the table.
     */
    importLcOpenDialog() {
        this.currentDetailView = "lcOpen";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[70px] w-[200px]" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[100px] w-[200px]", },
            { key: "lcRefNum", label: "LC Ref. NO", cssClass: "min-w-[150px] w-[150px]", },
            { key: "custNum", label: "Cust. Number", cssClass: "min-w-[120px] w-[150px]" },
            { key: "lcCurr", label: "Currency", cssClass: "min-w-[90px] w-[150px]" },
            { key: "lcAmt", label: "Lc Open Amt", cssClass: "min-w-[150px] w-[150px]", },
            { key: "lcConvRate", label: "Rate", cssClass: "min-w-[90px] w-[150px]", },
            { key: "lcBaseAmt", label: "Base Amount", cssClass: "min-w-[150px] w-[150px]", },
            { key: "expiryDate", label: "Expiry Date", cssClass: "min-w-[140px] w-[150px]", },
            { key: "tranBatchNo", label: "Batch Num.", cssClass: "min-w-[100px] w-[150px]", },
            { key: "tranDate", label: "Tran Date", cssClass: "min-w-[140px] w-[150px]", },
            { key: "authBy", label: "Entd. By", cssClass: "min-w-[90px] w-[150px]" },
            { key: "authOn", label: "Entd. On", cssClass: "min-w-[220px] w-[220px]", },
        ];

        this.paginationState.lcOpen.currentPage = 0;

        this.loadImportOpenDetails()
            .then(() => {
                console.log("Data loaded:", this.lcOpenDetails);

                if (this.lcOpenDetails && this.lcOpenDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Open Details",
                        columns: columns,
                        tableData: this.lcOpenDetails,
                        totalItems: this.paginationState.lcOpen.totalItems,
                        pageSize: this.paginationState.lcOpen.pageSize,
                        currentPage: this.paginationState.lcOpen.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import Open Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.lcOpen.pageSize,
                        currentPage: this.paginationState.lcOpen.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import Open Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.lcOpen.pageSize,
                    currentPage: this.paginationState.lcOpen.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import LC open details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportOpenDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.lcOpen;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportLcOpenDetailsModel>("/importDashboard/impOpenDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportLcOpenDetailsModel>) => {
                        console.log("Import Lc Page Response:", pageResponse);
                        this.lcOpenDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcAmt: this.formatAmount(Number(item.lcAmt)),
                            lcConvRate: this.formatAmount(Number(item.lcConvRate)),
                            lcBaseAmt: this.formatAmount(Number(item.lcBaseAmt))

                        }));
                        //this.lcOpenDetails = pageResponse.lcList;
                        this.paginationState.lcOpen.totalItems = pageResponse.totalElements;
                        this.paginationState.lcOpen.pageSize = pageResponse.pageSize;
                        this.paginationState.lcOpen.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import Amount details:", err);
                        this.importLcAmountDetails = [];
                        this.paginationState.lcOpen.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }
    /**
     * Opens the "Import Bill amount" detail view, loads data, and configures the table.
     */
    importBillAmtDialog() {
        this.currentDetailView = "importBill";

        const columns = [
            { key: "rn", label: "RN" },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[100px] w-[200px]", },
            { key: "billRefNum", label: "Bill Ref. Num.", cssClass: "min-w-[160px] w-[200px]", },
            { key: "lcRefNo", label: "LC Ref. Num.", cssClass: "min-w-[160px] w-[180px]", },
            { key: "lcCustNo", label: "Customer Num.", cssClass: "min-w-[140px] w-[200px]", },
            { key: "billCurr", label: "Currency", cssClass: "min-w-[80px] w-[200px]", },
            { key: "billAmt", label: "Bill Amount", cssClass: "min-w-[160px] w-[280px]", },
            { key: "expiryDate", label: "Expiry Date", cssClass: "min-w-[140px] w-[200px]", },
            { key: "billEntdBy", label: "Entd. By", cssClass: "min-w-[100px] w-[200px]", },
            { key: "billEntdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[270px]", },
        ];

        this.paginationState.importBill.currentPage = 0;

        this.loadImportBillDetails()
            .then(() => {
                console.log("Data loaded:", this.importBillAmountDetails);

                if (this.importBillAmountDetails && this.importBillAmountDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Bill Details",
                        columns: columns,
                        tableData: this.importBillAmountDetails,
                        totalItems: this.paginationState.importBill.totalItems,
                        pageSize: this.paginationState.importBill.pageSize,
                        currentPage: this.paginationState.importBill.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import Bill Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.importBill.pageSize,
                        currentPage: this.paginationState.importBill.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import Bill Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.importBill.pageSize,
                    currentPage: this.paginationState.importBill.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import bill details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportBillDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.importBill;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportBillAmtDetailsData>("/importDashboard/impBillAmtDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportBillAmtDetailsData>) => {
                        console.log("Import Lc Page Response:", pageResponse);
                        this.importBillAmountDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            billAmt: this.formatAmount(Number(item.billAmt))
                        }));
                        //this.importBillAmountDetails = pageResponse.lcList;
                        this.paginationState.importBill.totalItems = pageResponse.totalElements;
                        this.paginationState.importBill.pageSize = pageResponse.pageSize;
                        this.paginationState.importBill.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import Amount details:", err);
                        this.importBillAmountDetails = [];
                        this.paginationState.importBill.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Import Os amount" detail view, loads data, and configures the table.
     */
    importLcOsAmtDialog() {
        this.currentDetailView = "importOsAmt";

        const columns = [
            { key: "rn", label: "RN" },
            {
                key: "lcBrnCode",
                label: "Branch Code",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "lcRefNo",
                label: "LC Ref. No.",
                cssClass: "min-w-[130px] w-[200px]",
            },
            {
                key: "lcCustNum",
                label: "Customer No.",
                cssClass: "min-w-[130px] w-[200px]",
            },
            { key: "lcCurr", label: "Currency", cssClass: "min-w-[80px] w-[200px]" },
            {
                key: "lcAmount",
                label: "LC Amount",
                cssClass: "min-w-[100px] w-[280px]",
            },
            {
                key: "lcAmdEn",
                label: "LC Amount En.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "lcAmdRd",
                label: "LC Amount Rd.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "lcAccBill",
                label: "LC Acc. Amount",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "lcPay",
                label: "LC Payment",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "lcMnRev",
                label: "LC Mn Rev.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "lcTotalOsAmount",
                label: "LC Os Amount",
                cssClass: "min-w-[100px] w-[280px]",
            },
            {
                key: "lcEntdBy",
                label: "Entd. By",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "lcEntOn",
                label: "Entd. On",
                cssClass: "min-w-[220px] w-[270px]",
            },
        ];

        this.paginationState.importOsAmt.currentPage = 0;

        this.loadImportOsDetails()
            .then(() => {
                console.log("Data loaded:", this.importOsAmtDetails);

                if (this.importOsAmtDetails && this.importOsAmtDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Os Details",
                        columns: columns,
                        tableData: this.importOsAmtDetails,
                        totalItems: this.paginationState.importOsAmt.totalItems,
                        pageSize: this.paginationState.importOsAmt.pageSize,
                        currentPage: this.paginationState.importOsAmt.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import Os Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.importOsAmt.pageSize,
                        currentPage: this.paginationState.importOsAmt.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import Os Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.importOsAmt.pageSize,
                    currentPage: this.paginationState.importOsAmt.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import Os details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportOsDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.importOsAmt;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportLcOsAmtDetailsData>("/importDashboard/impOsAmtDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportLcOsAmtDetailsData>) => {
                        console.log("Import Lc Page Response:", pageResponse);
                        this.importOsAmtDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcAmount: this.formatAmount(Number(item.lcAmount)),
                            lcAmdEn: this.formatAmount(Number(item.lcAmdEn)),
                            lcAmdRd: this.formatAmount(Number(item.lcAmdRd)),
                            lcMnRev: this.formatAmount(Number(item.lcMnRev)),
                            lcAccBill: this.formatAmount(Number(item.lcAccBill)),
                            lcPay: this.formatAmount(Number(item.lcPay)),
                            lcTotalOsAmount: this.formatAmount(Number(item.lcTotalOsAmount))
                        }));
                        //this.importOsAmtDetails = pageResponse.lcList;
                        this.paginationState.importOsAmt.totalItems = pageResponse.totalElements;
                        this.paginationState.importOsAmt.pageSize = pageResponse.pageSize;
                        this.paginationState.importOsAmt.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import Amount details:", err);
                        this.importOsAmtDetails = [];
                        this.paginationState.importOsAmt.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Import pay  amount" detail view, loads data, and configures the table.
     */
    importPayAmtDialog() {
        this.currentDetailView = "importPayAmt";

        const columns = [
            { key: "rn", label: "RN" },
            { key: "lcBrnCode", label: "Branch Code", cssClass: "min-w-[100px] w-[200px]", },
            { key: "lcRefNum", label: "LC Ref. No.", cssClass: "min-w-[135px] w-[200px]", },
            { key: "billRefNo", label: "Bill Ref. No.", cssClass: "min-w-[135px] w-[200px]", },
            {
                key: "billPaySl",
                label: "Pay Serial",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billPartOrFinal",
                label: "Part/Final",
                cssClass: "min-w-[80px] w-[280px]",
            },
            {
                key: "billCustNo",
                label: "Customer No.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billCurr",
                label: "Currency",
                cssClass: "min-w-[80px] w-[200px]",
            },
            {
                key: "billPayAmt",
                label: "Payment Amount",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "tranBatchNo",
                label: "Tran Batch No.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "tranDate",
                label: "Tran Date",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billEntdBy",
                label: "Entd. By",
                cssClass: "min-w-[80px] w-[200px]",
            },
            {
                key: "billEntdOn",
                label: "Entd. On",
                cssClass: "min-w-[220px] w-[270px]",
            },
        ];

        this.paginationState.importPayAmt.currentPage = 0;

        this.loadImportPayDetails()
            .then(() => {
                console.log("Data loaded:", this.importPayAmtDetails);

                if (this.importPayAmtDetails && this.importPayAmtDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Pay Amount Details",
                        columns: columns,
                        tableData: this.importPayAmtDetails,
                        totalItems: this.paginationState.importPayAmt.totalItems,
                        pageSize: this.paginationState.importPayAmt.pageSize,
                        currentPage: this.paginationState.importPayAmt.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import Pay Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.importPayAmt.pageSize,
                        currentPage: this.paginationState.importPayAmt.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import Pay Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.importPayAmt.pageSize,
                    currentPage: this.paginationState.importPayAmt.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import pay amount details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportPayDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.importPayAmt;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportPayAmtDetailsData>("/importDashboard/impPayAmtDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportPayAmtDetailsData>) => {
                        console.log("Import Lc Page Response:", pageResponse);
                        this.importPayAmtDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            billPayAmt: this.formatAmount(Number(item.billPayAmt))
                        }));
                        //this.importPayAmtDetails = pageResponse.lcList;
                        this.paginationState.importPayAmt.totalItems = pageResponse.totalElements;
                        this.paginationState.importPayAmt.pageSize = pageResponse.pageSize;
                        this.paginationState.importPayAmt.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import Pay Amount details:", err);
                        this.importOsAmtDetails = [];
                        this.paginationState.importPayAmt.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Import payment pad  amount" detail view, loads data, and configures the table.
     */
    importPayPadAmtDialog() {
        this.currentDetailView = "importPayPadAmt";

        const columns = [
            { key: "rn", label: "RN" },
            {
                key: "lcBrnCode",
                label: "Branch Code",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billRefNo",
                label: "Bill Ref. No.",
                cssClass: "min-w-[135px] w-[200px]",
            },
            {
                key: "billPaySl",
                label: "Pay Serial",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billPartFinal",
                label: "Part/Final",
                cssClass: "min-w-[80px] w-[280px]",
            },
            {
                key: "billCustNo",
                label: "Customer No.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billCurr",
                label: "Currency",
                cssClass: "min-w-[80px] w-[200px]",
            },
            {
                key: "billPayAmt",
                label: "Payment Amount",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billPaybaseAmt",
                label: "Equivalent base amt. ",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billPadAccNo",
                label: "PAD Acc. No.",
                cssClass: "min-w-[160px] w-[220px]",
            },
            {
                key: "billPadAmt",
                label: "PAD Payment Amt.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "tranBatchNo",
                label: "Tran Batch No.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "tranDate",
                label: "Tran Date",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billEntdBy",
                label: "Entd. By",
                cssClass: "min-w-[80px] w-[200px]",
            },
            {
                key: "billEntdOn",
                label: "Entd. On",
                cssClass: "min-w-[220px] w-[270px]",
            },
        ];

        this.paginationState.importPayPadAmt.currentPage = 0;

        this.loadImportPadDetails()
            .then(() => {
                console.log("Data loaded:", this.importPayPadAmtDetails);

                if (this.importPayPadAmtDetails && this.importPayPadAmtDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Pad Amount Details",
                        columns: columns,
                        tableData: this.importPayPadAmtDetails,
                        totalItems: this.paginationState.importPayPadAmt.totalItems,
                        pageSize: this.paginationState.importPayPadAmt.pageSize,
                        currentPage: this.paginationState.importPayPadAmt.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import Pad Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.importPayPadAmt.pageSize,
                        currentPage: this.paginationState.importPayPadAmt.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import Pad Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.importPayPadAmt.pageSize,
                    currentPage: this.paginationState.importPayPadAmt.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import pad amount details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportPadDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.importPayPadAmt;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportPayPadAmtDetailsData>("/importDashboard/impPadAmtDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportPayPadAmtDetailsData>) => {
                        console.log("Import Lc Page Response:", pageResponse);
                        this.importPayPadAmtDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            billPayAmt: this.formatAmount(Number(item.billPayAmt)),
                            billPaybaseAmt: this.formatAmount(Number(item.billPaybaseAmt)),
                            billPadAmt: this.formatAmount(Number(item.billPadAmt))
                        }));
                        //this.importPayPadAmtDetails = pageResponse.lcList;
                        this.paginationState.importPayPadAmt.totalItems = pageResponse.totalElements;
                        this.paginationState.importPayPadAmt.pageSize = pageResponse.pageSize;
                        this.paginationState.importPayPadAmt.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import Pay Amount details:", err);
                        this.importPayPadAmtDetails = [];
                        this.paginationState.importPayPadAmt.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Import payment pad Os amount" detail view, loads data, and configures the table.
     */
    importPayPadOsDialog() {
        this.currentDetailView = "importPayPadOs";

        const columns = [
            { key: "rn", label: "RN" },
            {
                key: "lcBrnCode",
                label: "Branch Code",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billRef",
                label: "Bill Ref. No.",
                cssClass: "min-w-[135px] w-[200px]",
            },
            {
                key: "billPaySl",
                label: "Pay Serial",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billCustNo",
                label: "Customer No.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billCurr",
                label: "Currency",
                cssClass: "min-w-[80px] w-[200px]",
            },
            {
                key: "billPayAmt",
                label: "Payment Amount",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billPayBaseAmt",
                label: "Equivalent base amt. ",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billPadAcc",
                label: "PAD Acc. No.",
                cssClass: "min-w-[160px] w-[220px]",
            },
            {
                key: "billPadAmt",
                label: "PAD Payment Amt.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billPadOsAmt",
                label: "PAD Pay. Os Amt.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "tranBatchNo",
                label: "Tran Batch No.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "tranDate",
                label: "Tran Date",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billEntdBy",
                label: "Entd. By",
                cssClass: "min-w-[80px] w-[200px]",
            },
            {
                key: "billEntdOn",
                label: "Entd. On",
                cssClass: "min-w-[220px] w-[270px]",
            },
        ];

        this.paginationState.importPayPadOs.currentPage = 0;

        this.loadImportPadOsDetails()
            .then(() => {
                console.log("Data loaded:", this.importPayPadOsDetails);

                if (this.importPayPadOsDetails && this.importPayPadOsDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Pad Os Amount Details",
                        columns: columns,
                        tableData: this.importPayPadOsDetails,
                        totalItems: this.paginationState.importPayPadOs.totalItems,
                        pageSize: this.paginationState.importPayPadOs.pageSize,
                        currentPage: this.paginationState.importPayPadOs.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import Pad Os Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.importPayPadOs.pageSize,
                        currentPage: this.paginationState.importPayPadOs.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import Pad Amount Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.importPayPadOs.pageSize,
                    currentPage: this.paginationState.importPayPadOs.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import pad Os amount details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportPadOsDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.importPayPadOs;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportPayPadOsDetailsData>("/importDashboard/impPadOsAmtDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportPayPadOsDetailsData>) => {
                        console.log("Import Lc Page Response:", pageResponse);
                        this.importPayPadOsDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            billPayAmt: this.formatAmount(Number(item.billPayAmt)),
                            billPayBaseAmt: this.formatAmount(Number(item.billPayBaseAmt)),
                            billPadAmt: this.formatAmount(Number(item.billPadAmt)),
                            billPadOsAmt: this.formatAmount(Number(item.billPadOsAmt))
                        }));
                        //this.importPayPadOsDetails = pageResponse.lcList;
                        this.paginationState.importPayPadOs.totalItems = pageResponse.totalElements;
                        this.paginationState.importPayPadOs.pageSize = pageResponse.pageSize;
                        this.paginationState.importPayPadOs.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import Pad Pay Os Amount details:", err);
                        this.importPayPadOsDetails = [];
                        this.paginationState.importPayPadOs.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Import commission charge amount" detail view, loads data, and configures the table.
     */
    importCommAmtDialog() {
        this.currentDetailView = "importCommChg";

        const columns = [
            { key: "rn", label: "RN" },
            {
                key: "lcBrnCode",
                label: "Branch Code",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "lcRefNo",
                label: "Lc Ref. No.",
                cssClass: "min-w-[135px] w-[200px]",
            },
            {
                key: "lcAmdSL",
                label: "Am. Serial",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "lcCustNum",
                label: "Customer No.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            { key: "lcStatus", label: "Status", cssClass: "min-w-[80px] w-[200px]" },
            {
                key: "lcCommGLCode",
                label: "GL Code",
                cssClass: "min-w-[160px] w-[250px]",
            },
            {
                key: "lcCommAmount",
                label: "Commission amt. ",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "tranBatchNo",
                label: "Tran Batch No.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "tranDate",
                label: "Tran Date",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "lcEntdBy",
                label: "Entd. By",
                cssClass: "min-w-[80px] w-[200px]",
            },
            {
                key: "lcEntdOn",
                label: "Entd. On",
                cssClass: "min-w-[220px] w-[270px]",
            },
        ];

        this.paginationState.importCommChg.currentPage = 0;

        this.loadImportCommDetails()
            .then(() => {
                console.log("Data loaded:", this.importCommChgDetails);

                if (this.importCommChgDetails && this.importCommChgDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Comm. Charge Details",
                        columns: columns,
                        tableData: this.importCommChgDetails,
                        totalItems: this.paginationState.importCommChg.totalItems,
                        pageSize: this.paginationState.importCommChg.pageSize,
                        currentPage: this.paginationState.importCommChg.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import Pad Os Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.importCommChg.pageSize,
                        currentPage: this.paginationState.importCommChg.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import Comm. Charge Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.importCommChg.pageSize,
                    currentPage: this.paginationState.importCommChg.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import commission charge amount details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportCommDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.importCommChg;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportCommChgDetailsData>("/importDashboard/impCommAmtDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportCommChgDetailsData>) => {
                        console.log("Import Lc Page Response:", pageResponse);

                        this.importCommChgDetails = pageResponse.lcList;
                        this.paginationState.importCommChg.totalItems = pageResponse.totalElements;
                        this.paginationState.importCommChg.pageSize = pageResponse.pageSize;
                        this.paginationState.importCommChg.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import Comm. charge details:", err);
                        this.importCommChgDetails = [];
                        this.paginationState.importCommChg.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Import Bill Charge charge amount" detail view, loads data, and configures the table.
     */
    importBillAccAmtDialog() {
        this.currentDetailView = "importBillAcc";

        const columns = [
            { key: "rn", label: "RN" },
            {
                key: "brnCode",
                label: "Branch Code",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billRefNo",
                label: "Bill Ref. No.",
                cssClass: "min-w-[135px] w-[200px]",
            },
            {
                key: "customerNo",
                label: "Customer No.",
                cssClass: "min-w-[120px] w-[200px]",
            },
            {
                key: "billCurr",
                label: "Bill Currency",
                cssClass: "min-w-[80px] w-[200px]",
            },
            {
                key: "billAmt",
                label: "Bill Amount",
                cssClass: "min-w-[120px] w-[250px]",
            },
            {
                key: "billChgCurr",
                label: "Charge Currency ",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "accChgAmt",
                label: "Charge amt. ",
                cssClass: "min-w-[120px] w-[220px]",
            },
            { key: "glCode", label: "Gl Code ", cssClass: "min-w-[140px] w-[240px]" },
            {
                key: "tranBatchNo",
                label: "Tran Batch No.",
                cssClass: "min-w-[100px] w-[250px]",
            },
            {
                key: "tranDate",
                label: "Tran Date",
                cssClass: "min-w-[100px] w-[200px]",
            },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[80px] w-[200px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[270px]" },
        ];

        this.paginationState.importBillAcc.currentPage = 0;

        this.loadImportAccDetails()
            .then(() => {
                console.log("Data loaded:", this.importBillAccAmtDetails);

                if (this.importBillAccAmtDetails && this.importBillAccAmtDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Acc Bill Charge Details",
                        columns: columns,
                        tableData: this.importBillAccAmtDetails,
                        totalItems: this.paginationState.importBillAcc.totalItems,
                        pageSize: this.paginationState.importBillAcc.pageSize,
                        currentPage: this.paginationState.importBillAcc.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import Acc Bill Amount Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.importBillAcc.pageSize,
                        currentPage: this.paginationState.importBillAcc.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import Comm. Charge Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.importBillAcc.pageSize,
                    currentPage: this.paginationState.importBillAcc.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import commission charge amount details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportAccDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.importBillAcc;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportBillAccAmtDetailsData>("/importDashboard/impAccAmtDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportBillAccAmtDetailsData>) => {
                        console.log("Import Acc Bill Page Response:", pageResponse);
                        this.importBillAccAmtDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            billAmt: this.formatAmount(Number(item.billAmt)),
                            accChgAmt: this.formatAmount(Number(item.accChgAmt))

                        }));
                        //this.importBillAccAmtDetails = pageResponse.lcList;
                        this.paginationState.importBillAcc.totalItems = pageResponse.totalElements;
                        this.paginationState.importBillAcc.pageSize = pageResponse.pageSize;
                        this.paginationState.importBillAcc.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import Acc charge details:", err);
                        this.importCommChgDetails = [];
                        this.paginationState.importCommChg.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Import Bill Charge charge amount" detail view, loads data, and configures the table.
     */
    importPayChgAmtDialog() {
        this.currentDetailView = "importPayChg";

        const columns = [
            { key: "rn", label: "RN" },
            {
                key: "brnCode",
                label: "Branch Code",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billRefNo",
                label: "Bill Ref. No.",
                cssClass: "min-w-[135px] w-[200px]",
            },
            {
                key: "paySl",
                label: "Payment Sl.",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "billCurr",
                label: "Bill Currency",
                cssClass: "min-w-[80px] w-[200px]",
            },
            {
                key: "customerNo",
                label: "Customer No.",
                cssClass: "min-w-[140px] w-[250px]",
            },
            {
                key: "chrgGlCode1",
                label: "Gl Code",
                cssClass: "min-w-[130px] w-[220px]",
            },
            {
                key: "chrgAmt1",
                label: "Charge amt. ",
                cssClass: "min-w-[120px] w-[220px]",
            },
            {
                key: "chrgGlCode2",
                label: "Gl Code ",
                cssClass: "min-w-[130px] w-[240px]",
            },
            {
                key: "chrgeAmt2",
                label: "Charge amt.",
                cssClass: "min-w-[120px] w-[240px]",
            },
            {
                key: "chrgGlCode3",
                label: "Gl code",
                cssClass: "min-w-[130px] w-[220px]",
            },
            {
                key: "chrgAmt3",
                label: "Charge amt.",
                cssClass: "min-w-[120px] w-[240px]",
            },
            {
                key: "totalCharges",
                label: "Total Charge Amt.",
                cssClass: "min-w-[120px] w-[240px]",
            },
            {
                key: "tranBatchNo",
                label: "Tran Batch No.",
                cssClass: "min-w-[100px] w-[250px]",
            },
            {
                key: "tranDate",
                label: "Tran Date",
                cssClass: "min-w-[100px] w-[200px]",
            },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[80px] w-[200px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[270px]" },
        ];

        this.paginationState.importPayChgAmt.currentPage = 0;

        this.loadImportPayChgDetails()
            .then(() => {
                console.log("Data loaded:", this.importPayChgAmtDetails);

                if (this.importPayChgAmtDetails && this.importPayChgAmtDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Acc Bill Charge Details",
                        columns: columns,
                        tableData: this.importPayChgAmtDetails,
                        totalItems: this.paginationState.importPayChgAmt.totalItems,
                        pageSize: this.paginationState.importPayChgAmt.pageSize,
                        currentPage: this.paginationState.importPayChgAmt.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import Pay Charge Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.importPayChgAmt.pageSize,
                        currentPage: this.paginationState.importPayChgAmt.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import Pay Charge Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.importPayChgAmt.pageSize,
                    currentPage: this.paginationState.importPayChgAmt.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import commission charge amount details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportPayChgDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.importPayChgAmt;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportPayChgAmtDetailsData>("/importDashboard/impPayChgDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportPayChgAmtDetailsData>) => {
                        console.log("Import Pay Chg Page Response:", pageResponse);
                        this.importPayChgAmtDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            chrgAmt1: this.formatAmount(Number(item.chrgAmt1)),
                            chrgeAmt2: this.formatAmount(Number(item.chrgeAmt2)),
                            chrgAmt3: this.formatAmount(Number(item.chrgAmt3)),
                            totalCharges: this.formatAmount(Number(item.totalCharges))
                        }));
                        // this.importPayChgAmtDetails = pageResponse.lcList;
                        this.paginationState.importPayChgAmt.totalItems = pageResponse.totalElements;
                        this.paginationState.importPayChgAmt.pageSize = pageResponse.pageSize;
                        this.paginationState.importPayChgAmt.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import Pay charge details:", err);
                        this.importPayChgAmtDetails = [];
                        this.paginationState.importPayChgAmt.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the "Import Open charge amount" detail view, loads data, and configures the table.
     */
    importOpenChgAmtDialog() {
        this.currentDetailView = "importOpnChg";

        const columns = [
            { key: "rn", label: "RN" },
            {
                key: "brnCode",
                label: "Branch Code",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "lcRefNo",
                label: "Bill Ref. No.",
                cssClass: "min-w-[135px] w-[200px]",
            },
            {
                key: "lcOpSl",
                label: "Serial",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "custNum",
                label: "Customer No.",
                cssClass: "min-w-[140px] w-[200px]",
            },
            {
                key: "lcCategory",
                label: "Category",
                cssClass: "min-w-[80px] w-[250px]",
            },
            {
                key: "commGlAcc",
                label: "Comm. GL",
                cssClass: "min-w-[130px] w-[220px]",
            },
            {
                key: "commChgAmt",
                label: "Charge amt. ",
                cssClass: "min-w-[120px] w-[220px]",
            },
            {
                key: "swfGlAcc",
                label: "Swift GL",
                cssClass: "min-w-[130px] w-[240px]",
            },
            {
                key: "swfChgAmt",
                label: "Charge amt.",
                cssClass: "min-w-[120px] w-[240px]",
            },
            {
                key: "tranBatchNo",
                label: "Tran Batch No.",
                cssClass: "min-w-[100px] w-[250px]",
            },
            {
                key: "tranDate",
                label: "Tran Date",
                cssClass: "min-w-[100px] w-[200px]",
            },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[80px] w-[200px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[270px]" },
        ];

        this.paginationState.importOpnChg.currentPage = 0;

        this.loadImportOpenChgDetails()
            .then(() => {
                console.log("Data loaded:", this.importOpenChargeDetails);

                if (this.importOpenChargeDetails && this.importOpenChargeDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Open Charge Details",
                        columns: columns,
                        tableData: this.importOpenChargeDetails,
                        totalItems: this.paginationState.importOpnChg.totalItems,
                        pageSize: this.paginationState.importOpnChg.pageSize,
                        currentPage: this.paginationState.importOpnChg.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import Open Charge Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.importOpnChg.pageSize,
                        currentPage: this.paginationState.importOpnChg.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import Open Charge Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.importOpnChg.pageSize,
                    currentPage: this.paginationState.importOpnChg.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import commission charge amount details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportOpenChgDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.importOpnChg;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportOpenCharge>("/importDashboard/impOpnChgDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportOpenCharge>) => {
                        console.log("Import Pay Chg Page Response:", pageResponse);
                        this.importOpenChargeDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            commChgAmt: this.formatAmount(Number(item.commChgAmt)),
                            swfChgAmt: this.formatAmount(Number(item.swfChgAmt))
                        }));
                        // this.importOpenChargeDetails = pageResponse.lcList;
                        this.paginationState.importOpnChg.totalItems = pageResponse.totalElements;
                        this.paginationState.importOpnChg.pageSize = pageResponse.pageSize;
                        this.paginationState.importOpnChg.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import Pay charge details:", err);
                        this.importOpenChargeDetails = [];
                        this.paginationState.importOpnChg.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
    * Opens the "Import Open charge amount" detail view, loads data, and configures the table.
    */
    importVatAmtDialog() {
        this.currentDetailView = "importVatAmt";

        const columns = [
            { key: "rn", label: "RN" },
            {
                key: "brnCode",
                label: "Branch Code",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "refNum",
                label: "LC Ref.",
                cssClass: "min-w-[135px] w-[200px]",
            },
            {
                key: "opSl",
                label: "Serial",
                cssClass: "min-w-[80px] w-[200px]",
            },
            {
                key: "custNum",
                label: "Customer No.",
                cssClass: "min-w-[140px] w-[200px]",
            },
            {
                key: "lcCategory",
                label: "Category",
                cssClass: "min-w-[80px] w-[250px]",
            },
            {
                key: "vatGl1",
                label: "Vat GL",
                cssClass: "min-w-[130px] w-[220px]",
            },
            {
                key: "lcVatAmt1",
                label: "Vat amt. ",
                cssClass: "min-w-[120px] w-[220px]",
            },
            {
                key: "vatGl2",
                label: "Vat GL",
                cssClass: "min-w-[130px] w-[240px]",
            },
            {
                key: "lcVatAmt2",
                label: "Vat amt.",
                cssClass: "min-w-[120px] w-[240px]",
            },
            {
                key: "tranBatchNo",
                label: "Tran Batch No.",
                cssClass: "min-w-[100px] w-[250px]",
            },
            {
                key: "tranDate",
                label: "Tran Date",
                cssClass: "min-w-[100px] w-[200px]",
            },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[80px] w-[200px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[270px]" },
        ];

        this.paginationState.importVatAmt.currentPage = 0;

        this.loadImportVatDetails()
            .then(() => {
                console.log("Data loaded:", this.importLcVatDetails);

                if (this.importLcVatDetails && this.importLcVatDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Vat Details",
                        columns: columns,
                        tableData: this.importLcVatDetails,
                        totalItems: this.paginationState.importVatAmt.totalItems,
                        pageSize: this.paginationState.importVatAmt.pageSize,
                        currentPage: this.paginationState.importVatAmt.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import Vat Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.importVatAmt.pageSize,
                        currentPage: this.paginationState.importVatAmt.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import Vat Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.importVatAmt.pageSize,
                    currentPage: this.paginationState.importVatAmt.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import commission charge amount details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportVatDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.importVatAmt;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportLcVatDetailsData>("/importDashboard/impLcVatDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportLcVatDetailsData>) => {
                        console.log("Import vat Page Response:", pageResponse);
                        this.importLcVatDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcVatAmt1: this.formatAmount(Number(item.lcVatAmt1)),
                            lcVatAmt2: this.formatAmount(Number(item.lcVatAmt2))
                        }));
                        // this.importOpenChargeDetails = pageResponse.lcList;
                        this.paginationState.importVatAmt.totalItems = pageResponse.totalElements;
                        this.paginationState.importVatAmt.pageSize = pageResponse.pageSize;
                        this.paginationState.importVatAmt.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import vat details:", err);
                        this.importLcVatDetails = [];
                        this.paginationState.importVatAmt.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
    * Opens the "Import Open charge amount" detail view, loads data, and configures the table.
    */
    importTaxAmtDialog() {
        this.currentDetailView = "importTaxAmt";

        const columns = [
            { key: "rn", label: "RN" },
            {
                key: "brnCode",
                label: "Branch Code",
                cssClass: "min-w-[100px] w-[200px]",
            },
            {
                key: "lcRefNo",
                label: "LC Ref.",
                cssClass: "min-w-[135px] w-[200px]",
            },
            {
                key: "opSl",
                label: "Serial",
                cssClass: "min-w-[80px] w-[200px]",
            },
            {
                key: "custNum",
                label: "Customer No.",
                cssClass: "min-w-[140px] w-[200px]",
            },
            {
                key: "lcCategory",
                label: "Category",
                cssClass: "min-w-[80px] w-[250px]",
            },
            {
                key: "lcTaxCurr",
                label: "Tax Currency",
                cssClass: "min-w-[80px] w-[220px]",
            },
            {
                key: "taxGlCode",
                label: "Tax GL",
                cssClass: "min-w-[120px] w-[220px]",
            },
            {
                key: "lcTaxAmt",
                label: "Tax Amount",
                cssClass: "min-w-[130px] w-[240px]",
            },
            {
                key: "tranBatchNo",
                label: "Tran Batch No.",
                cssClass: "min-w-[100px] w-[250px]",
            },
            {
                key: "tranDate",
                label: "Tran Date",
                cssClass: "min-w-[100px] w-[200px]",
            },
            { key: "entdBy", label: "Entd. By", cssClass: "min-w-[80px] w-[200px]" },
            { key: "entdOn", label: "Entd. On", cssClass: "min-w-[220px] w-[270px]" },
        ];

        this.paginationState.importTaxAmt.currentPage = 0;

        this.loadImportTaxDetails()
            .then(() => {
                console.log("Data loaded:", this.importLcTaxDetails);

                if (this.importLcTaxDetails && this.importLcTaxDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Import Tax Details",
                        columns: columns,
                        tableData: this.importLcTaxDetails,
                        totalItems: this.paginationState.importTaxAmt.totalItems,
                        pageSize: this.paginationState.importTaxAmt.pageSize,
                        currentPage: this.paginationState.importTaxAmt.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Import tax Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.importTaxAmt.pageSize,
                        currentPage: this.paginationState.importTaxAmt.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Import tax Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.importTaxAmt.pageSize,
                    currentPage: this.paginationState.importTaxAmt.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated import commission charge amount details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadImportTaxDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.importTaxAmt;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<ImportLcTaxDetailsData>("/importDashboard/impLcTaxDtls", {
                    year: this.importForm.get("year")?.value || "",
                    branchCode: this.importForm.get("branchCode")?.value || "",
                    currency: this.importForm.get("currencyCode")?.value || "",
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<ImportLcTaxDetailsData>) => {
                        console.log("Import tax Page Response:", pageResponse);
                        this.importLcTaxDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            lcTaxAmt: this.formatAmount(Number(item.lcTaxAmt))
                        }));
                        // this.importOpenChargeDetails = pageResponse.lcList;
                        this.paginationState.importTaxAmt.totalItems = pageResponse.totalElements;
                        this.paginationState.importTaxAmt.pageSize = pageResponse.pageSize;
                        this.paginationState.importTaxAmt.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Import tax details:", err);
                        this.importLcTaxDetails = [];
                        this.paginationState.importTaxAmt.totalItems = 0;
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
        if (this.currentDetailView === "pendingLc" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.pendingLcDetails,
                totalItems: this.paginationState.pendingLc.totalItems,
                pageSize: this.paginationState.pendingLc.pageSize,
                currentPage: this.paginationState.pendingLc.currentPage,
            };
        }

        if (this.currentDetailView === "importAmt" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.importLcAmountDetails,
                totalItems: this.paginationState.importAmt.totalItems,
                pageSize: this.paginationState.importAmt.pageSize,
                currentPage: this.paginationState.importAmt.currentPage,
            };
        }

        if (this.currentDetailView === "lcOpen" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.lcOpenDetails,
                totalItems: this.paginationState.lcOpen.totalItems,
                pageSize: this.paginationState.lcOpen.pageSize,
                currentPage: this.paginationState.lcOpen.currentPage,
            };
        }
        if (this.currentDetailView === "importBill" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.importBillAmountDetails,
                totalItems: this.paginationState.importBill.totalItems,
                pageSize: this.paginationState.importBill.pageSize,
                currentPage: this.paginationState.importBill.currentPage,
            };
        }
        if (this.currentDetailView === "importOsAmt" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.importOsAmtDetails,
                totalItems: this.paginationState.importOsAmt.totalItems,
                pageSize: this.paginationState.importOsAmt.pageSize,
                currentPage: this.paginationState.importOsAmt.currentPage,
            };
        }
        if (this.currentDetailView === "importPayAmt" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.importPayAmtDetails,
                totalItems: this.paginationState.importPayAmt.totalItems,
                pageSize: this.paginationState.importPayAmt.pageSize,
                currentPage: this.paginationState.importPayAmt.currentPage,
            };
        }
        if (this.currentDetailView === "importPayPadAmt" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.importPayPadAmtDetails,
                totalItems: this.paginationState.importPayPadAmt.totalItems,
                pageSize: this.paginationState.importPayPadAmt.pageSize,
                currentPage: this.paginationState.importPayPadAmt.currentPage,
            };
        }
        if (this.currentDetailView === "importPayPadOs" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.importPayPadOsDetails,
                totalItems: this.paginationState.importPayPadOs.totalItems,
                pageSize: this.paginationState.importPayPadOs.pageSize,
                currentPage: this.paginationState.importPayPadOs.currentPage,
            };
        }
        if (this.currentDetailView === "importCommChg" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.importCommChgDetails,
                totalItems: this.paginationState.importCommChg.totalItems,
                pageSize: this.paginationState.importCommChg.pageSize,
                currentPage: this.paginationState.importCommChg.currentPage,
            };
        }
        if (this.currentDetailView === "importBillAcc" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.importBillAccAmtDetails,
                totalItems: this.paginationState.importBillAcc.totalItems,
                pageSize: this.paginationState.importBillAcc.pageSize,
                currentPage: this.paginationState.importBillAcc.currentPage,
            };
        }
        if (this.currentDetailView === "importPayChg" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.importPayChgAmtDetails,
                totalItems: this.paginationState.importPayChgAmt.totalItems,
                pageSize: this.paginationState.importPayChgAmt.pageSize,
                currentPage: this.paginationState.importPayChgAmt.currentPage,
            };
        }
        if (this.currentDetailView === "importOpnChg" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.importOpenChargeDetails,
                totalItems: this.paginationState.importOpnChg.totalItems,
                pageSize: this.paginationState.importOpnChg.pageSize,
                currentPage: this.paginationState.importOpnChg.currentPage,
            };
        }
        if (this.currentDetailView === "importVatAmt" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.importLcVatDetails,
                totalItems: this.paginationState.importVatAmt.totalItems,
                pageSize: this.paginationState.importVatAmt.pageSize,
                currentPage: this.paginationState.importVatAmt.currentPage,
            };
        }
        if (this.currentDetailView === "importTaxAmt" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.importLcTaxDetails,
                totalItems: this.paginationState.importTaxAmt.totalItems,
                pageSize: this.paginationState.importTaxAmt.pageSize,
                currentPage: this.paginationState.importTaxAmt.currentPage,
            };
        }
    }

    /**
     * Marks the branch code form control as invalid with a specific error type.
     * @param errorType The type of validation error (e.g., 'pattern').
     */
    private markBranchCodeAsInvalid(errorType: string) {
        const currencyControl = this.importForm.get("branchCode");
        if (currencyControl) {
            currencyControl.markAsDirty();
            currencyControl.markAsTouched();

            if (errorType === "pattern") {
                currencyControl.setErrors({ pattern: true });
            }
        }
    }

    /**
     * Provides a user-friendly error message for the branch code field based on validation state.
     * @returns Error message string or empty if no error.
     */
    get branchCodeErrorMessage(): string {
        const control = this.importForm.get("branchCode");
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

    /**
     * Clears pattern errors from the branch code field when it becomes empty on blur.
     */
    onBranchCodeBlur() {
        const control = this.importForm.get("branchCode");
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
     * Marks the currency code form control as invalid with a specific error type.
     * @param errorType The type of validation error ('pattern' or 'maxlength').
     */
    private markCurrencyAsInvalid(errorType: string) {
        const currencyControl = this.importForm.get("currencyCode");
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
        const control = this.importForm.get("currencyCode");

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
     * Retrieves the currency symbol based on the selected currency code.
     * Falls back to '$' if not found.
     * @returns The currency symbol as a string.
     */
    getCurrencySymbol(): string {
        const currencyCode = this.importForm.get("currencyCode")?.value || this.selectCurrencyCode;
        return this.currencyMap.get(currencyCode?.toUpperCase()) || "$";
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
            this.loadImportPendingLcDetails();
        }
        if (this.currentDetailView === "importAmt") {
            this.paginationState.importAmt.currentPage = event.pageIndex;
            this.paginationState.importAmt.pageSize = event.pageSize;
            this.loadImportAmountDetails();
        }
        if (this.currentDetailView === "lcOpen") {
            this.paginationState.lcOpen.currentPage = event.pageIndex;
            this.paginationState.lcOpen.pageSize = event.pageSize;
            this.loadImportOpenDetails();
        }
        if (this.currentDetailView === "importBill") {
            this.paginationState.importBill.currentPage = event.pageIndex;
            this.paginationState.importBill.pageSize = event.pageSize;
            this.loadImportBillDetails();
        }
        if (this.currentDetailView === "importOsAmt") {
            this.paginationState.importOsAmt.currentPage = event.pageIndex;
            this.paginationState.importOsAmt.pageSize = event.pageSize;
            this.loadImportOsDetails();
        }
        if (this.currentDetailView === "importPayAmt") {
            this.paginationState.importPayAmt.currentPage = event.pageIndex;
            this.paginationState.importPayAmt.pageSize = event.pageSize;
            this.loadImportPayDetails();
        }
        if (this.currentDetailView === "importPayPadAmt") {
            this.paginationState.importPayPadAmt.currentPage = event.pageIndex;
            this.paginationState.importPayPadAmt.pageSize = event.pageSize;
            this.loadImportPadDetails();
        }
        if (this.currentDetailView === "importPayPadOs") {
            this.paginationState.importPayPadOs.currentPage = event.pageIndex;
            this.paginationState.importPayPadOs.pageSize = event.pageSize;
            this.loadImportPadOsDetails();
        }
        if (this.currentDetailView === "importCommChg") {
            this.paginationState.importCommChg.currentPage = event.pageIndex;
            this.paginationState.importCommChg.pageSize = event.pageSize;
            this.loadImportCommDetails();
        }
        if (this.currentDetailView === "importBillAcc") {
            this.paginationState.importBillAcc.currentPage = event.pageIndex;
            this.paginationState.importBillAcc.pageSize = event.pageSize;
            this.loadImportAccDetails();
        }
        if (this.currentDetailView === "importPayChg") {
            this.paginationState.importPayChgAmt.currentPage = event.pageIndex;
            this.paginationState.importPayChgAmt.pageSize = event.pageSize;
            this.loadImportPayChgDetails();
        }
        if (this.currentDetailView === "importOpnChg") {
            this.paginationState.importOpnChg.currentPage = event.pageIndex;
            this.paginationState.importOpnChg.pageSize = event.pageSize;
            this.loadImportOpenChgDetails();
        }
        if (this.currentDetailView === "importVatAmt") {
            this.paginationState.importVatAmt.currentPage = event.pageIndex;
            this.paginationState.importVatAmt.pageSize = event.pageSize;
            this.loadImportVatDetails();
        }
        if (this.currentDetailView === "importTaxAmt") {
            this.paginationState.importTaxAmt.currentPage = event.pageIndex;
            this.paginationState.importTaxAmt.pageSize = event.pageSize;
            this.loadImportTaxDetails();
        }
    }
    private formatAmount(value: number | null | undefined): string {
        if (value === null || value === undefined) return "0.00";
        return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}
