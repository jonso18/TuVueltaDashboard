import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessagesService } from '../../services/messages/messages.service';


@Component({
  selector: 'app-data-transaccion-servicio',
  templateUrl: './data-transaccion-servicio.component.html',
  styleUrls: ['./data-transaccion-servicio.component.css']
})
export class DataTransaccionServicioComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public subs: Subscription[] = [];
  @Output() onValid: EventEmitter<any> = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.emmiter();
    this.onValid.emit(this.form.value);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private buildForm(): void {
    const today: Date = new Date();
    this.form = this.formBuilder.group({
      Fecha: [today, [Validators.required]],
      Hora: [today.getHours(), [
        Validators.required,
        Validators.min(0),
        Validators.max(24)
      ]],
      Minutos: [today.getMinutes(), [
        Validators.required,
        Validators.min(0),
        Validators.max(60)
      ]]
    });
  }

  private emmiter(): void {
    this.subs.push(this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(val => {
        this.onValid.emit(this.form.value);
      }));
  }

  public getErrorMessage(Control: FormControl): string {
    return this.messagesService.getErrorMessage(Control);

  }

  get Fecha() { return this.form.get('Fecha'); }
  get Hora() { return this.form.get('Hora'); }
  get Minutos() { return this.form.get('Minutos'); }

}
