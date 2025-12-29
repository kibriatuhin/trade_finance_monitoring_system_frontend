import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({ providedIn: 'root' })
export class BusyService {
  private busyRequestCount = 0;

  constructor(private spinner: NgxSpinnerService) {}

  busy() {
    if (this.busyRequestCount === 0) {
      this.spinner.show('global', {
        type: 'ball-spin-clockwise-fade',
        bdColor: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        size: 'default'
      });
    }
    this.busyRequestCount++;
  }

  idle() {
    this.busyRequestCount--;

    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinner.hide('global');
    }
  }
}
