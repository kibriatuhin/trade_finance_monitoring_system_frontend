import { Component } from '@angular/core';
import { DashboardCardComponent } from "../../component/dashboard-card/dashboard-card.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  
  ImportVolumeDialog(){

  }
}
