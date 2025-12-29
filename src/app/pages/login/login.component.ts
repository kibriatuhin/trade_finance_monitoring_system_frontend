import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  showPassword = false;

  togglePassword() {
  this.showPassword = !this.showPassword;
}
  constructor(private el: ElementRef,private router: Router){}

  /** Reference to the year select input field for initial focus. */
      @ViewChild("userId") userId!: ElementRef<HTMLInputElement>;

  /** Reactive form group for managing login form inputs (year and currency). */
      loginForm: FormGroup = new FormGroup({
          userId: new FormControl(""),
          password: new FormControl(""),
          
      });


       /**
     * Focuses the year select input field after the view has been initialized.
     */
    ngAfterViewInit() {
        setTimeout(() => {
            this.userId?.nativeElement.focus();
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

        /*
        // Validate branchCode
        if (target?.getAttribute("formControlName") === "branchCode") {
            this.validateBranchCodeInput(event, target);
            return;
        }

        // Validate currencyCode
        if (target?.getAttribute("formControlName") === "currencyCode") {
            this.validateCurrencyCodeInput(event, target);
        } */
    }

     // ─── ENTER KEY ───────────────────────────────────────────────
    private handleEnterKey(event: KeyboardEvent, target: HTMLInputElement, nextControl?: string, isLast: boolean = false): void {
        event.preventDefault();

        if (isLast) {
            this.onSubmit();
            return;
        }

        //if (target.getAttribute("formControlName") === "branchCode") {
            //this.showBranchCodeErrors = false;
       // }

        if (nextControl) {
            this.focusField(nextControl);
        }
    }
    // ─── F2 KEY (PREVIOUS FIELD) ─────────────────────────────────
    private handleF2Key(event: KeyboardEvent, target: Element): void {
        event.preventDefault();

        const fieldOrder = ["userId", "password", "login"];
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
     * Submits the form by triggering data loading from the dashboard service.
     */
    onSubmit() {
        console.log("Form submitted press done ");
        this.router.navigate(['/blank']);
       // this.loadDashboardData();
    }

}
