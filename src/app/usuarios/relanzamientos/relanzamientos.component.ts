import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IRelanzamiento } from '../../interfaces/relanzamiento.interface';
import { DbService } from '../../services/db/db.service';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { FormControl, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { TransactionResult } from '@firebase/database/dist/esm/src/api/TransactionResult';
@Component({
  selector: 'app-relanzamientos',
  templateUrl: './relanzamientos.component.html',
  styleUrls: ['./relanzamientos.component.css']
})
export class RelanzamientosComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public Relanzamientos: IRelanzamiento[];
  @Input() public Id: string;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  public dataSource: MatTableDataSource<IRelanzamiento> = new MatTableDataSource<IRelanzamiento>();
  public displayedColumns = ['Id', 'Fecha', 'GananciaMensajero', 'Multa', 'servicio_id', 'Acciones'];
  public inputFilter: FormControl;

  private subs: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dbService: DbService,
    private fbApp: FirebaseApp,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    console.log('iniciando relanzamiento')
    this.loadFilter();
  }

  ngOnDestroy() {
    console.log('iniciando relanzamiento')
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {
    this.instanceTable()
  }

  /**
   * This prepare the filter to navigate trhout the table information
   * 
   * @private
   * @returns void
   * @memberof RelanzamientosComponent
   */
  private loadFilter(): void {
    this.inputFilter = this.formBuilder.control(null);
    this.subs.push(
      this.inputFilter.valueChanges
        .debounceTime(500)
        .distinctUntilChanged()
        .subscribe((val: string) => {
          this.dataSource.filter = val.trim().toLowerCase();
        }))
  }

  /**
   * Prepare the table data to be shown in the DOM
   * 
   * @private
   * @memberof RelanzamientosComponent
   */
  private instanceTable(): void {
    if (this.Relanzamientos) {
      this.dataSource.data = this.Relanzamientos;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageSizeOptions = [5, 10, 20];
    }
  }

  /**
   * Firstly do a firebase transaction which aim to Mensajero's CreditoRetiro
   * amount and discount the fine by relounch a service. 
   * After that, this remove the Relanzamiento's log from db.
   * 
   * @public
   * @param {IRelanzamiento} relanzamiento 
   * @memberof RelanzamientosComponent
   */
  public onRemove(relanzamiento: IRelanzamiento): void {
    relanzamiento.isDeleting = true;
    console.log(relanzamiento)
    this.fbApp.database()
      .ref(`/Operativo/Logs/GananciasMensjero/${this.Id}/CreditosRetiro`)
      .transaction(amount => amount + relanzamiento.Multa)
      .then((res: TransactionResult) => {
        if (res.committed)
          return this.dbService.objectRelanzamiento(this.Id, relanzamiento.$key).remove()
        return Promise.reject("No se actualizo el credito de retiro")
      })
      .then(res => {
        console.log(res)
        this.snackBar.open('Se ha eliminado el Relanzamiento Exitosamente.', 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
      })
      .catch(err => {
        console.log(err)
      });
  }

}
