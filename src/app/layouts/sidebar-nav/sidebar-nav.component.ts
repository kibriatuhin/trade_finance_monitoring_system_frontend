import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { TabService } from "../../services/tabServices/tab.service";

@Component({
    selector: "app-sidebar-nav",
    standalone: true,
    imports: [RouterModule, MatListModule, MatIconModule, MatButtonModule, CommonModule],
    templateUrl: "./sidebar-nav.component.html",
    styleUrl: "./sidebar-nav.component.css",
})
export class SidebarNavComponent {
    @Input() isSidebarOpen: boolean = true;
    @Output() sidebarToggle = new EventEmitter<void>();

    isSubmenuOpen: number[] = []; // store open submenu indexes
    isActiveMenu: number[] = []; // store active button indexes

    constructor(private tabService: TabService) {}

    openTab(title: string, route: string) {
        this.tabService.openTab(title, route);
    }

    toggleSubmenu(menuIndex: number) {
        if (this.isSubmenuOpen.includes(menuIndex)) {
            // if already open → close it
            this.isSubmenuOpen = this.isSubmenuOpen.filter((i) => i !== menuIndex);
            this.isActiveMenu = this.isActiveMenu.filter((i) => i !== menuIndex);
        } else {
            // if closed → open it
            this.isSubmenuOpen.push(menuIndex);
            this.isActiveMenu.push(menuIndex);
        }
    }

    // toggleSubmenu2() {
    //   this.isSubmenuOpen2 = !this.isSubmenuOpen2;
    // }
}
