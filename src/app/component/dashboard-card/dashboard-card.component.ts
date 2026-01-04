import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIcon, MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-dashboard-card",
    standalone: true,
    imports: [CommonModule, MatCardModule , MatIconModule,MatIcon],
    templateUrl: "./dashboard-card.component.html",
    styleUrl: "./dashboard-card.component.css",
})
export class DashboardCardComponent {
    @Input() value: string | number = "";
    @Input() label: string = "Metric";
    @Input() currencySymbol: string | null = ""; // e.g., '$', '৳', or null
    @Input() valueColor: string = "text-emerald-800"; // Tailwind class (default)
    @Input() hoverBgColor: string = "hover:bg-emerald-800";
    @Input() buttonLabel: string = "View Details";
    @Input() showButton: boolean = true;
    @Input() cardFixedColor: boolean = false;
    @Input() cardBackgroundColor: string = "bg-white";
    @Input() cardWhiteColor: boolean = true;
    // ✅ NEW (Dynamic Icon Concept)
  @Input() icon: string = "description";          // mat-icon name
  @Input() iconColor: string = "text-blue-600";   // icon color class
  @Input() iconBgColor: string = "bg-blue-50";    // icon container bg class

    @Output() buttonClick = new EventEmitter<void>();

    onButtonClick(): void {
        this.buttonClick.emit();
    }

    // Helper: Format display value
    get displayValue(): string {
        if (this.currencySymbol) {
            return `${this.currencySymbol}${this.value}`;
        }
        return `${this.value}`;
    }
}
