import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [RouterModule, RouterOutlet,BrowserModule],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css'
})
export class BlankLayoutComponent {

}
