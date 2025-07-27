import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `Page 0 of 0`;
    }

    const totalPages = Math.ceil(length / pageSize);
    const currentPage = page + 1;
    return `Page ${currentPage} of ${totalPages}`;
  };
}
