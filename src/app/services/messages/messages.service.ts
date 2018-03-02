import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';

@Injectable()
export class MessagesService {

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  public getErrorMessage(Control: FormControl): string {
    const errors: string[] = Object.keys(Control.errors);

    switch (errors[0]) {
      case 'required':
        return `Campo <strong>Obligatorio</strong>`;

      case 'min':
        return `Valor Minimo admitido es <strong>${Control.errors.min.min}</strong>`;

      case 'max':
        return `Valor máximo admitido es <strong>${Control.errors.max.max}</strong>`;

      default:
        return 'Error Desconocido'
    }

  }

}
