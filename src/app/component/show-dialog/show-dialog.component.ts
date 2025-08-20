import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostListener } from '@angular/core';
import { QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Currency } from '../../shared/interface/Currency';


@Component({
  selector: 'app-show-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-dialog.component.html',
  styleUrl: './show-dialog.component.css',
})
export class ShowDialogComponent {
  @Input() show = false;
  @Input() currencies: Currency[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<Currency>();
  @ViewChildren('currencyRow') currencyRows!: QueryList<
    ElementRef<HTMLTableRowElement>
  >;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef<HTMLDivElement>;
   @ViewChild('dialogContainer', { static: false }) dialogContainer!: ElementRef<HTMLDivElement>;

  hoveredIndex: number = 0;

  ngAfterViewInit() {
    // Focus the dialog when it opens
    if (this.show && this.dialogContainer) {
      setTimeout(() => {
        this.dialogContainer.nativeElement.focus();
      }, 0);
    }
  }

  ngOnChanges() {
    // Focus the dialog when show property changes
    if (this.show && this.dialogContainer) {
      setTimeout(() => {
        this.dialogContainer.nativeElement.focus();
        this.dialogContainer.nativeElement.setAttribute('tabindex', '-1'); // Make it focusable
      }, 0);
    }
  }
  onCancel() {
    this.close.emit();
    this.hoveredIndex = 0;
  }

  onSelect(currency: Currency) {
    this.select.emit(currency);
    this.hoveredIndex = 0;
  }

  @HostListener('window:keydown', ['$event'])
  onCurrencyKeyDown(event: KeyboardEvent) {
    if (!this.show) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
       event.stopPropagation();
      this.hoveredIndex = Math.min(
        this.hoveredIndex + 1,
        this.currencies.length - 1
      );
      this.scrollToHovered();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
       event.stopPropagation();
      this.hoveredIndex = Math.max(this.hoveredIndex - 1, 0);
      this.scrollToHovered();
    } else if (event.key === 'Enter') {
      event.preventDefault();
       event.stopPropagation();
      const selected = this.currencies[this.hoveredIndex];
      if (selected) this.onSelect(selected);
    } else if (event.key === 'Escape') {
      event.preventDefault();
       event.stopPropagation();
      this.onCancel();
    }
  }

  // scrollToHovered() {
  //   const hoveredRow = this.currencyRows.get(this.hoveredIndex);
  //   if (hoveredRow) {
  //     hoveredRow.nativeElement.scrollIntoView({
  //       block: 'nearest',
  //       behavior: 'smooth',
  //     });
  //   }
  // }

  scrollToHovered() {
  const container = this.scrollContainer?.nativeElement;
  const hoveredRow = this.currencyRows.get(this.hoveredIndex)?.nativeElement;

  if (container && hoveredRow) {
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    const rowTop = hoveredRow.offsetTop;
    const rowBottom = rowTop + hoveredRow.offsetHeight;

    if (rowTop < containerTop) {
      // Scroll up only if row is above the visible area
      container.scrollTop = rowTop;
    } else if (rowBottom > containerBottom) {
      // Scroll down only if row is below the visible area
      container.scrollTop = rowBottom - container.clientHeight;
    }
  }
}
}
