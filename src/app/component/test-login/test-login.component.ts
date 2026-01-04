import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';


@Component({
  selector: 'app-test-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './test-login.component.html',
  styleUrl: './test-login.component.css'
})
export class TestLoginComponent {
showPassword = false;
  passwordValue = '';
  constructor() { }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onPasswordInput() {
    
    if (!this.passwordValue?.length) this.showPassword = false;
  }
}
