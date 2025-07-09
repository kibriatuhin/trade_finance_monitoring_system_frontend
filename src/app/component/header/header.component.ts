import { Component, EventEmitter, Output } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule,MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() sideBarToggle = new EventEmitter<void>();

  sideBarToggleButton(){
    this.sideBarToggle.emit();
  }
}
