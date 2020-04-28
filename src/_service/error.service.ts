import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  statusMessage = "Could not Connect to Server. Please check your Network."

  constructor(public snackBar: MatSnackBar,
    private zone: NgZone) { }

  public open(statusCode, action = '', duration = 4000) {
    if (statusCode) {
      this.zone.run(() => {
        this.snackBar.open(this.statusMessage, action, {
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
