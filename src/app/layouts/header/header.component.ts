import { Component, EventEmitter, Output } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenu,MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule,MatToolbarModule, MatIconModule ,MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() sideBarToggle = new EventEmitter<void>();
  isDropdownOpen = false;
  sideBarToggleButton(){
    this.sideBarToggle.emit();
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onBlur() {
    // Optional: close on blur (when clicking outside)
    // You can also use a click-outside directive for better UX
    // For now, we'll keep it simple
  }

  onSetting() {
    console.log('Go to settings');
    this.isDropdownOpen = false;
    // Add your logic here
  }

  onLogout() {
    console.log('Logging out...');
    this.isDropdownOpen = false;
    // Add logout logic (e.g., auth service)
  }
}
