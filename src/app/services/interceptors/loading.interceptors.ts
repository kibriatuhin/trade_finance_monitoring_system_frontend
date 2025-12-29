import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { BusyService } from '../spinner-Service/busy.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);
  if (req.headers.has('skipLoader')) {
    const cleanReq = req.clone({
      headers: req.headers.delete('skipLoader')
    });
    return next(cleanReq);
  }

  busyService.busy();


  return next(req).pipe(
    finalize(() => busyService.idle())
  );
};
