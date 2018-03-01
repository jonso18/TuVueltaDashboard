import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class MessagesService {

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }


}
