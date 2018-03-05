import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MessagesService } from '../../services/messages/messages.service';
import { IUser } from '../../interfaces/usuario.interface';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { dataConfirmation } from '../../config/dialogs.data';
import { FirebaseApp } from 'angularfire2';

@Component({
  selector: 'app-no-retirement-credit-dialog',
  templateUrl: './no-retirement-credit-dialog.component.html',
  styleUrls: ['./no-retirement-credit-dialog.component.css']
})
export class NoRetirementCreditDialogComponent implements OnInit {

  private question: string = '';
  private title: string = '';
  private user: IUser;
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<NoRetirementCreditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private messageService: MessagesService,
    private dialog: MatDialog,
    private fbApp: FirebaseApp
  ) { }

  ngOnInit() {
    this.user = this.data.user;
    this.question = `Qué cantidad desea agregarle a credito de retiro al usuario ${this.user.Nombres} ${this.user.Apellidos}`;
    this.title = `Credito de No Retiro`;
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      Amount: [null, [
        Validators.required,
        Validators.min(0),
        Validators.pattern('^(0|[1-9][0-9]*)$')
      ]]
    })
  }

  onSubmit() {
    const isValid: boolean = this.form.valid;
    if (isValid) {
      const title: string = `Confirmar Credito de No Retiro`;
      const question: string = `Desea aumentar <strong>$ ${this.Amount.value}</strong> al saldo de Creditos de No Retiro del usuario <strong>${this.user.Nombres} ${this.user.Apellidos}</strong>`;
      let dialogRef = this.dialog.open(ConfirmationComponent, dataConfirmation(title, question));
      dialogRef.afterClosed()
        .subscribe(res => {
          if (res) {
            this.fbApp.database()
              .ref(`/Operativo/Logs/GananciasMensjero/${this.user.$key}/CreditosNoRetiro`)
              .transaction(res => Number(res) + Number(this.Amount.value))
              .then(res => this.dialogRef.close(true))
              .catch(err => console.log(err))
          }
        })
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public getErrorMessage(Control: FormControl) {
    return this.messageService.getErrorMessage(Control)
  }

  get Amount() { return this.form.get('Amount'); }
}
