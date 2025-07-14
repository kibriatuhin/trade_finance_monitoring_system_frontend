import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-total-import-amount',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule,MatCardModule],
  templateUrl: './total-import-amount.component.html',
  styleUrl: './total-import-amount.component.css'
})
export class TotalImportAmountComponent {

}
