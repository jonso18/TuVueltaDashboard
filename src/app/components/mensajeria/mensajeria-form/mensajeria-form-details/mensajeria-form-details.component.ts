import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { METODOS_PAGO } from '../../../../config/MetodosPago';
import { MessagesService } from '../../../../services/messages/messages.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-mensajeria-form-details',
  templateUrl: './mensajeria-form-details.component.html',
  styleUrls: ['./mensajeria-form-details.component.css']
})
export class MensajeriaFormDetailsComponent implements OnInit {
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public form: FormGroup;
  private _infoCreditPayment: any;
  constructor(
    private formBuilder: FormBuilder,
    private messages: MessagesService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.loadRules();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      QueEnviar: [null, Validators.required],
      MetodoDePago: [null, Validators.required],
      DebeComprar: [false],
      CodigoPromocional: [null],
      Asegurar: [false],
      FotoRecibido: [false],
      FirmaRecibido: [false],
      Instrucciones: [null]
    })
  }

  private loadRules(): void {
    this.validatorMetodoPago();
    this.validatorAsegurar();
  }

  private validatorAsegurar(): void {
    this.Asegurar
      .valueChanges
      .do(() => this.loading$.next(true))
      .debounceTime(500)
      .do(() => this.loading$.next(false))
      .distinctUntilChanged()
      .subscribe((val: boolean) => {
        if (val)
          return this.form.addControl(
            'ValorAAsegurar',
            this.formBuilder.control(null, Validators.required)
          )
        if (this.ValorAAsegurar)
          return this.form.removeControl('ValorAAsegurar')
      })
  }

  private validatorMetodoPago(): void {
    this.MetodoDePago
      .valueChanges
      .do(() => this.loading$.next(true))
      .debounceTime(500)
      .do(() => this.loading$.next(false))
      .distinctUntilChanged()
      .subscribe((val: string) => {
        switch (val) {
          case METODOS_PAGO.Credito:
            this.form.addControl(
              'InfoPagoCredito',
              this.formBuilder.group({
                NombresTitular: [null, Validators.required],
                Nombres: [null, Validators.required],
                ApellidosTitular: [null, Validators.required],
                Apellidos: [null, Validators.required],
                DocumentoTitular: [null, Validators.required],
                NumDocumento: [null, Validators.required],
                EmailTitular: [null, Validators.required],
                CorreoElectrónico: [null, Validators.required],
                CiudadTitular: [null, Validators.required],
                CiudadResidencia: [null, Validators.required],
                DirecciónTitular: [null, Validators.required],
                Dirección: [null, Validators.required],
                NúmeroDeTarjeta: [null, Validators.required],
                Númerotarjeta: [null, Validators.required],
                FechaVencimiento: [null, Validators.required],
                CódigoCVV: [null, Validators.required]
              })
            );
            if (this._infoCreditPayment)
              this.InfoPagoCredito
                .patchValue(this._infoCreditPayment);
            break;
          case METODOS_PAGO.Efectivo:
            if (this.InfoPagoCredito) {
              this._infoCreditPayment = this.InfoPagoCredito.value;
            }
            this.form.removeControl('InfoPagoCredito');
            break;
          default:
            break;
        }
      })
  }

  public getErrorMessage(control: FormControl): string{
    return this.messages.getErrorMessage(control)
  }

  get QueEnviar() { return this.form.get('QueEnviar') }
  get InfoPagoCredito() { return this.form.get('InfoPagoCredito') as FormGroup }
  get MetodoDePago() { return this.form.get('MetodoDePago') }
  get DebeComprar() { return this.form.get('DebeComprar') }
  get CodigoPromocional() { return this.form.get('CodigoPromocional') }
  get Asegurar() { return this.form.get('Asegurar') }
  get FotoRecibido() { return this.form.get('FotoRecibido') }
  get FirmaRecibido() { return this.form.get('FirmaRecibido') }
  get ValorAAsegurar() { return this.form.get('ValorAAsegurar') }
  get Instrucciones() { return this.form.get('Instrucciones') }
}

