import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';
import { DbService } from '../../../services/db/db.service';
import { ROLES } from '../../../config/Roles';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-reporte-clientes-servicios',
  templateUrl: './reporte-clientes-servicios.component.html',
  styleUrls: ['./reporte-clientes-servicios.component.css']
})
export class ReporteClientesServiciosComponent implements OnInit {
  events: string[] = [];
  public dateStart;
  public dateEnd;
  public solicitudes;
  public Clientes;
  public logsSolicitudes;
  public clientSelected = null;
  public reporteHTML = '';
  public canSend: boolean;
  @ViewChild('picker') public _picker;
  constructor(
    private dbService: DbService,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadSolicitudes();
    this.loadLogsSolicitud();
    this.loadClientes();
  }

  loadClientes(){
    const cliente = ROLES.Cliente
    this.dbService.listUsersByRol(cliente).subscribe(res => {
      
      this.Clientes = res;
    })
  }

  loadLogsSolicitud() {
    this.dbService.listLogSolicitud().snapshotChanges()
      .map(changes =>
        changes
          .map(item =>
            ({ key: item.payload.key, data: item.payload.val() })))
      .subscribe(res => {
        const data = {};
        res.forEach(item => {
          const value = item.data;
          data[item.key] = Object.keys(value).map(key => {
            return {
              key: key,
              value: value[key]
            }
          });
        })
        console.log(data)
        this.logsSolicitudes = data;
      })
  }

  loadSolicitudes() {
    this.dbService.listSolicitudFinalizadas().snapshotChanges().subscribe(res => {
      this.solicitudes = res;
      console.log(this.solicitudes)
    })
  }
  pickerStart(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(new Date(event.value))
    this.dateStart = new Date(event.value).getTime();
  }

  pickerEnd(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(new Date(event.value))
    this.dateEnd = new Date(event.value).getTime();
  }

  generateReport() {
    let fechaproceso;
    let fechachaDespachado;
    let FechaFinalizado;
    this.reporteHTML = '';
    this.reporteHTML+='<h1 class="text-center">Reporte de servicios</h1>';
    const s_finalizadas = this.solicitudes.filter(item => {
      if (item.key > this.dateStart && item.key < this.dateEnd && this.clientSelected.$key == item.payload.val().user_id){
        item['logs'] = this.logsSolicitudes[item.key]
        return item
      }
    })
    console.log(s_finalizadas)

    s_finalizadas.forEach(element => {
      let logs = '';
      element.logs.forEach(log => {
        
        if(log.value.Estado === "EnProceso"){
          fechaproceso = new Date(Number(log.key));
        }

        if(log.value.Estado === "Despachado"){
          fechachaDespachado = new Date(Number(log.key));
        }
        
        if(log.value.Estado === "Finalizado"){
          FechaFinalizado = new Date(Number(log.key));
        }
        


        //const date = new Date(Number(log.key));
        //console.log(log)
        //logs+=`<li><strong>Tiempo Proceso a Despachado: ${fechaproceso} </strong> </li> `
        //logs+=`<li><strong>Tiempo Proceso a en proceso: ${fechachaDespachado}</strong> </li> `
        //logs+=`<li><strong>Fecha:  </strong> ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</li>`
        //logs+=`<li><strong>Estado:  </strong>${log.value.Estado}</li>`
        //logs+=`<li><strong>Mensajero Id: </strong> ${log.value.Motorratoner_id}</li>`
        
        
      });
      const date = new Date(Number(element.key));

      var diasDifdespacho=  fechachaDespachado.getTime() - fechaproceso.getTime();
      var diasDiffFinalizado=  FechaFinalizado.getTime() - fechachaDespachado.getTime();

      var totaltiempodespacho = Math.round(diasDifdespacho/(60*24*60));
      var totaltiempoFinalizado = Math.round(diasDiffFinalizado/(60*24*60));
    

      this.reporteHTML+=`
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th class="text-center">Id</th>
              <th>Fecha</th>
              <th>Datos Cliente</th>
              <th>Tiempo Despacho</th>
              <th>Tiempo Finalización</th>
            </tr>
          </thead>
          <tbody>
            <td >${element.key}</td>
            <td > ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
            <td >${element.payload.val().Nombres}</td>
            <td >${totaltiempodespacho}</td>
            <td >${totaltiempoFinalizado}</td>
          </tbody>
        </table>
      </div>`
    });

    this.canSend = true;
  }

  sendEmal(){
    console.log("sending email ...")
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    console.log(this.clientSelected)
    if (this.clientSelected.Correo){
      const url = 'https://us-central1-tuvueltap.cloudfunctions.net/api/reportes/enviar-mail';
    const body = {
      to: this.clientSelected.Correo,
      text: this.reporteHTML,
      subject: 'Reporte TuVuelta'
    }
    const p = this.http.post(url, body, httpOptions).toPromise()
    }else {
      alert("El Cliente seleccionado no tiene correo registrado")
    }
    
    
  }
}
