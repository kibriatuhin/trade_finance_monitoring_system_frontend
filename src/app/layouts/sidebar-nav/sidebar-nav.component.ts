import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { TabService } from "../../services/tabServices/tab.service";
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTree, MatTreeNode, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatTreeModule } from '@angular/material/tree';
import { MenuItem } from '../../shared/models/MenuItem.model';
import { TREE_DATA } from "../../shared/utils/menu-data";





@Component({
    selector: "app-sidebar-nav",
    standalone: true,
    imports: [RouterModule, MatListModule, MatIconModule, MatButtonModule, CommonModule,MatTreeModule, MatTree, MatTreeNode],
    templateUrl: "./sidebar-nav.component.html",
    styleUrl: "./sidebar-nav.component.css",
})
export class SidebarNavComponent implements OnInit{
    @Input() isSidebarOpen: boolean = true;
    @Output() sidebarToggle = new EventEmitter<void>();

  

   // Track expanded menus
  isActiveMenu: number[] = [];
  isSubmenuOpen: number[] = [];

  // Tree control and data source
  treeControl = new NestedTreeControl<MenuItem>(node => node.children);
  treeDataSource = new MatTreeNestedDataSource<MenuItem>();

  constructor(private router: Router,private tabService: TabService) {}

  isLeafLikeParent(node: MenuItem): boolean {
  if (!node.children || node.children.length === 0) {
    return false;
  }
  return node.children.every(child => !child.children || child.children.length === 0);
}


  ngOnInit(): void {
    this.treeDataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: MenuItem) => !!node.children && node.children.length > 0;

  toggleSubmenu(id: number): void {
    const node = this.findNodeById(id);
    if (node) {
      if (this.treeControl.isExpanded(node)) {
        this.treeControl.collapse(node);
        this.isSubmenuOpen = this.isSubmenuOpen.filter(i => i !== id);
      } else {
        this.treeControl.expand(node);
        this.isSubmenuOpen.push(id);
      }
      this.isActiveMenu = [id]; 
    }
  }

  openTab(tabKey: string, route: string): void {
    this.tabService.openTab(tabKey, route);
  }

  private findNodeById(id: number): MenuItem | undefined {
    const stack: MenuItem[] = [...this.treeDataSource.data];
    while (stack.length) {
      const node = stack.shift();
      if (node?.id === id) return node;
      if (node?.children) {
        stack.push(...node.children);
      }
    }
    return undefined;
  }

  
}
