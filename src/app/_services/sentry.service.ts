import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'
import * as Sentry from '@sentry/browser';


Sentry.init({
  dsn: 'https://fe2b773d490d4ef287859825633e1ee4@o459007.ingest.sentry.io/5457501'
});

@Injectable({
  providedIn: 'root'
})
export class SentryService implements ErrorHandler{

  constructor(
    private injector: Injector) { }

  handleError(error: any) {
    const router = this.injector.get(Router);
    // capture error to sentry cloud
    const eventId = Sentry.captureException(error.originalError || error);
    if (Error instanceof HttpErrorResponse) {
    console.log(error.status);
    }
    else {
    console.error("an error occured here mate");
    // ask user to report error if error not server related
    Sentry.showReportDialog({ eventId });
    }
  }
}
