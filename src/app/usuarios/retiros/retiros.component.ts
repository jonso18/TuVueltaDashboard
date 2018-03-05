import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { IRetiros } from '../../interfaces/retiros.interface';
import { MatSnackBar, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { FirebaseApp } from 'angularfire2';
import { DbService } from '../../services/db/db.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ESTADOS_RETIRO } from '../../config/EstadosRetiro';
import { TransactionResult } from '@firebase/database/dist/esm/src/api/TransactionResult';

@Component({
  selector: 'app-retiros',
  templateUrl: './retiros.component.html',
  styleUrls: ['./retiros.component.css']
})
export class RetirosComponent implements OnInit {
  @Input() Retiros: IRetiros[];
  @Input() Id: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  public dataSource: MatTableDataSource<IRetiros> = new MatTableDataSource<IRetiros>();
  public displayedColumns = ['Id', 'Fecha', 'Estado', 'MontoARetirar', 'Acciones'];
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
    if (this.Retiros) {
      this.dataSource.data = this.Retiros;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageSizeOptions = [5, 10, 20];
    }
  }

  /**
   * Update to approved retiro status.
   * 
   * @param {IRetiros} retiro 
   * @memberof RetirosComponent
   */
  public onPass(retiro: IRetiros) {
    this.dbService.objectRetiro(this.Id, retiro.$key).update({
      Estado: ESTADOS_RETIRO.Aprobado
    })
      .then(res => {
        this.snackBar.open('Se ha Aprobado el Retiro Exitosamente.', 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
      }).catch(err => {
        console.log(err)
      });
  }

  /**
   * Update to canceled retiro status.
   * 
   * @param {IRetiros} retiro 
   * @memberof RetirosComponent
   */
  public onCancel(retiro: IRetiros) {
    const MontoARetirar: number = Number(retiro.MontoARetirar);
    this.fbApp.database()
      .ref(`/Operativo/Logs/GananciasMensjero/${this.Id}/CreditosRetiro`)
      .transaction(amount => amount + MontoARetirar)
      .then((res: TransactionResult) => {
        if (res.committed)
          return this.dbService.objectRetiro(this.Id, retiro.$key).update({
            Estado: ESTADOS_RETIRO.Cancelado
          })
        return Promise.reject("No se actualizo el retiro")
      })
      .then(res => {
        console.log(res)
        this.snackBar.open('Se ha Cancelado el Retiro Exitosamente.', 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
      })
      .catch(err => {
        console.log(err)
      });
  }
}
