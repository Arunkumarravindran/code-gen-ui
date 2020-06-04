import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  statusMessage = "Could not Connect to Server. Please check your Network."

  constructor(public snackBar: MatSnackBar,
    private zone: NgZone) { }

  public open(statusCode, action = '', duration = 3000) {
    if (statusCode) {
      this.zone.run(() => {
        this.snackBar.open(statusCode, action, {
          duration, verticalPosition: 'top',
          panelClass: ['snackbar']
        })
      })
    }
    else {
      this.zone.run(() => {
        this.snackBar.open(this.statusMessage, action, {
          duration, verticalPosition: 'top',
          panelClass: ['snackbar']
        })
      })
    }

  }

}
