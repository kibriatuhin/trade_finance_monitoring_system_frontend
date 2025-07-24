import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TransactionTableComponent } from "../../component/transaction-table/transaction-table.component"; // for mat-icon-button

@Component({
  selector: 'app-import-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TransactionTableComponent 
],
  templateUrl: './import-details.component.html',
  styleUrls: ['./import-details.component.css'] // fixed from `styleUrl`
})
export class ImportDetailsComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      brnCode: ['', Validators.required],
      currencyCode: ['', Validators.required],
      transactionMaxLimit: ['', Validators.required],
      alternateFundServiceType: ['']
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
