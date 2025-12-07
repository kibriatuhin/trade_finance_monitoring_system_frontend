import { CommonModule } from "@angular/common";
import { Component, ChangeDetectorRef } from "@angular/core";
import { FormControl, FormsModule, NgSelectOption } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { ViewChild, AfterViewInit } from "@angular/core";
import { ElementRef } from "@angular/core";
import { HostListener } from "@angular/core";
import { ShowDialogComponent } from "../../component/show-dialog/show-dialog.component";
import { ExportSummaryData } from "../../shared/models/export/ExportSummaryData";
import { ExportDashServiceService } from "../../services/export-dashboard/export-dash-service.service";
import { Currency } from "../../shared/interface/Currency";
import { DashboardCardComponent } from "../../component/dashboard-card/dashboard-card.component";
import { DashboardDataService } from "../../services/dashboard/dashboard-data.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: 'app-import-details',
  standalone: true,
  imports: [
    CommonModule, DashboardCardComponent, MatCardModule, MatSelectModule, FormsModule, MatIcon, ReactiveFormsModule, ShowDialogComponent
],
  templateUrl: './import-details.component.html',
  styleUrls: ['./import-details.component.css'] // fixed from `styleUrl`
})
export class ImportDetailsComponent {
   viewMode: "cards" | "details" = "cards";
    selectedYear: number = new Date().getFullYear();
    selectCurrencyCode: string = "";
    showBranchCodeErrors: boolean = false;
    showCurrencyErrors: boolean = false;
    years: number[] = [];

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

    constructor(private dashboardService: DashboardDataService, private dialog: MatDialog, private cdr: ChangeDetectorRef, private el: ElementRef, private router: Router) {}

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
        //this.loadDashboardData();
    }

    /**
     * Updates the selected year from the form control (currently unused for data reload).
     */
    onYearChange(): void {
        this.yearSelect = this.exportForm.get("year")?.value;
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
}
