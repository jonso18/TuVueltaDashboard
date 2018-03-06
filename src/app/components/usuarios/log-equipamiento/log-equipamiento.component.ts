import { Component, OnInit, SimpleChanges, ViewChild, Input } from '@angular/core';
import { ILogEquipamiento } from '../../../interfaces/logequipamiento.interface';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-log-equipamiento',
  templateUrl: './log-equipamiento.component.html',
  styleUrls: ['./log-equipamiento.component.css']
})
export class LogEquipamientoComponent implements OnInit {

  @Input() Log: ILogEquipamiento[];
  @Input() Id: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  public dataSource: MatTableDataSource<ILogEquipamiento> = new MatTableDataSource<ILogEquipamiento>();
  public displayedColumns = ['Id', 'Fecha', 'ChaquetaMensajero', 'EquipoMensajero', 'EquipoMoto', 'MontoParaTrabajarHoy'];
  public inputFilter: FormControl;

  private subs: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder
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
    if (this.Log) {
      this.dataSource.data = this.Log;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageSizeOptions = [5, 10, 20];
    }
  }

}
