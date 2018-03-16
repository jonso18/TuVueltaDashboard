import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { METODOS_PAGO } from '../../../../config/MetodosPago';
import { MessagesService } from '../../../../services/messages/messages.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DbService } from '../../../../services/db/db.service';
import { IBonoDescuento } from '../../../../interfaces/bono-descuento.interface';

@Component({
  selector: 'app-mensajeria-form-details',
  templateUrl: './mensajeria-form-details.component.html',
  styleUrls: ['./mensajeria-form-details.component.css']
})
export class MensajeriaFormDetailsComponent implements OnInit, OnDestroy {

  
  @Output() onEdit: EventEmitter<any> = new EventEmitter();

  public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public form: FormGroup;
  private _infoCreditPayment: any;
  public CostoSeguro: any;
  public BonosDescuento: IBonoDescuento[];
  public bonoDescuentoMsg: string;
  public subs: Subscription[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private messages: MessagesService,
    private db: AngularFireDatabase,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.subs.push(this.loadBonusDiscount());
    this.loadRules();
    this.subs.push(this.loadEventEmiters());
    this.subs.push(this.loadCostoSeguro());
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      MetodoDePago: [METODOS_PAGO.Efectivo, Validators.required],
      DebeComprar: [false],
      CodigoPromocional: [null],
      Asegurar: [false],
      FotoRecibido: [false],
      FirmaRecibido: [false],
      ComprarAlgo: [false],
      Instrucciones: [null],
      BonoDescuento: [null]
    })
  }


  private loadBonusDiscount(): Subscription {
    return this.dbService.listBonoDescuento().subscribe(bonus => {
      this.BonosDescuento = bonus;
    })
  }

  private loadRules(): void {
    this.subs.push(this.validatorMetodoPago());
    this.subs.push(this.validatorComprarAlgo());
    this.subs.push(this.validatorCostoAsegurar());
    this.subs.push(this.validatorBonoDescuento());
  }

  private loadEventEmiters(): Subscription {
    return this.form
      .valueChanges
      .debounceTime(100)
      .distinctUntilChanged()
      .subscribe(val => this.onEdit.emit({
        isValid: this.form.valid,
        value: this.form.value
      })
      )
  }

  private loadCostoSeguro(): Subscription {
    return this.db.list(`/Administrativo/ReglasMensajeria/CostoSeguro`)
      .valueChanges()
      .merge(this.Asegurar.valueChanges
        .do(() => this.loading$.next(true))
        .do(console.log)
        .debounceTime(500)
        .do(() => this.loading$.next(false)))
      .subscribe(res => {
        const addControl = () => {
          if (this.Asegurar.value) {
            const value = this.ValorAAsegurar ? this.ValorAAsegurar.value : 0;
            this.form.removeControl('ValorAAsegurar')
            this.form.addControl('ValorAAsegurar',
              this.formBuilder.control(value, [
                Validators.required,
                Validators.min(0),
                Validators.max(this.CostoSeguro ? this.CostoSeguro[this.CostoSeguro.length - 1].Hasta : 0)
              ])
            )
          } else {
            return this.form.removeControl('ValorAAsegurar')
          }
        }

        if (typeof res == 'object') {
          this.CostoSeguro = res;
          if (!this.ValorAAsegurar) return addControl()
          this.ValorAAsegurar.setValidators([
            Validators.required,
            Validators.min(0),
            Validators.max(this.CostoSeguro ? this.CostoSeguro[this.CostoSeguro.length - 1].Hasta : 0)
          ])
          this.ValorAAsegurar.updateValueAndValidity()
        }

        if (typeof res == 'boolean') {
          addControl();

        }
      })
  }



  private validatorComprarAlgo(): Subscription {
    return this.ComprarAlgo
      .valueChanges
      .do(() => this.loading$.next(true))
      .debounceTime(500)
      .do(() => this.loading$.next(false))
      .distinctUntilChanged()
      .subscribe((val: boolean) => {
        if (val)
          return this.form.addControl(
            'DetallesComprarAlgo',
            this.formBuilder.group({
              Monto: this.formBuilder.control(null, [Validators.required, Validators.min(0)]),
              Descripcion: this.formBuilder.control(null, Validators.required)
            })
          )
        if (this.DetallesComprarAlgo)
          return this.form.removeControl('DetallesComprarAlgo')
      })

  }

  private validatorCostoAsegurar(): Subscription {
    return this.form
      .valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(res => {
        if (res.ValorAAsegurar && this.CostoSeguro) {

          if (res.ValorAAsegurar < this.CostoSeguro[0].Hasta) {
            if (!this.CobroAsegurar)
              this.form.addControl('CobroAsegurar', this.formBuilder.control(null))
            this.CobroAsegurar.setValue(res.ValorAAsegurar * this.CostoSeguro[0].CobroPorcentaje)
          } else {
            for (let i = this.CostoSeguro.length; i > 0; i--) {
              const element = this.CostoSeguro[i - 1];
              if (this.CostoSeguro[i - 2]) {
                if (this.CostoSeguro[i - 2].Hasta < res.ValorAAsegurar &&
                  this.CostoSeguro[i - 1].Hasta >= res.ValorAAsegurar) {
                  if (!this.CobroAsegurar)
                    this.form.addControl('CobroAsegurar', this.formBuilder.control(null))
                  this.CobroAsegurar.setValue(res.ValorAAsegurar * this.CostoSeguro[i - 1].CobroPorcentaje)
                }
              } else {

              }
            }
          }


        } else {
          if (this.CobroAsegurar) this.form.removeControl('CobroAsegurar')
        }
      })
  }

  private validatorBonoDescuento(): Subscription {
    return this.BonoDescuento
      .valueChanges
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe((_bonus: string) => {

        if (this.ValorDescuento) this.form.removeControl('ValorDescuento');
        const bonus: IBonoDescuento = this.BonosDescuento.find(data => data.Clave == _bonus);
        if (bonus == undefined) {
          this.bonoDescuentoMsg = `
          <div class="alert alert-danger">
            <strong>Bono no valido</strong>
            <p>El bono ingresado no está registrado en la base de datos.</p>
          </div>
          `;
          return
        };
        const now: number = new Date().getTime();
        if (now > bonus.Inicio && now < bonus.Fin) {
          this.bonoDescuentoMsg = `
          <div class="alert alert-info">
            <strong>${bonus.Nombre}</strong>
            <p>Descuento efectuado del ${bonus.Descuento * 100} %, lo veras reflejado cuando hagas la cotización</p>
          </div>
          `;
          this.form.addControl('ValorDescuento', this.formBuilder.control(bonus.Descuento))
        } else {
          const Inicio = new Date(bonus.Inicio);
          const Fin = new Date(bonus.Fin);
          const getFormatedDate = (date: Date): string => {
            return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
          }
          this.bonoDescuentoMsg = `
          <div class="alert alert-warning">
            <strong>Descuento inhabilitado</strong>
            <p>El bono <strong>${bonus.Nombre}</strong> es valido del 
            <strong>${getFormatedDate(Inicio)}</strong> hasta 
            <strong>${getFormatedDate(Fin)}</strong>
          </div>
          `;
        }



      })
  }

  private validatorMetodoPago(): Subscription {
    return this.MetodoDePago
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

  public getErrorMessage(control: FormControl): string {
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
  get ComprarAlgo() { return this.form.get('ComprarAlgo') }
  get DetallesComprarAlgo() { return this.form.get('DetallesComprarAlgo') as FormGroup }
  get CobroAsegurar() { return this.form.get('CobroAsegurar') }
  get BonoDescuento() { return this.form.get('BonoDescuento') }
  get ValorDescuento() { return this.form.get('ValorDescuento') }
}



/* 
0 - 500 el seguro es gratis
500 - 2000 000 se calcula un % del 2 % del valor asegurado

ese 2% no se tiene en cuena para la ganancia del mensajero
la ganancia del mensajero se 

la ganancia del mensajero es del 0.7


si el mensajero solo puede comprar la mensajeria si en creditos de retiro  */