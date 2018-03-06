import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';
import { DbService } from '../../../../services/db/db.service';
import { ROLES } from '../../../../config/Roles';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../services/auth/auth.service';
import { environment } from '../../../../../environments/environment';

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
    this.loadMensajeros();
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
    const fechainicio = new Date(this.dateStart).toLocaleDateString();
    const fechafin = new Date(this.dateEnd).toLocaleDateString();
    let totalpedidos;
    let ValorDeDomicilios = 0;
    let fechaproceso;
    let fechachaDespachado;
    let FechaFinalizado;
    this.reporteHTML = '';
    this.reporteHTML+=`
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml"> 
     <head> 
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    
      <body style="margin: 0; padding: 0;">
        <table align="center" border="1" cellpadding="0" cellspacing="0" width="1200" style="border-collapse: collapse;">
                <tr>
                    <td align="center" bgcolor="#000" style="padding: 40px 0 30px 0;"> 
                            <img src="http://www.somostuvuelta.co/img/Tu_vuelta_3.png" alt="tuvuelta.co" width="480" height="auto" style="display: block; margin-left: auto; margin-right: auto" />
                            <h1 style="color: #ffffff;"><font color="#ffffff">Reporte de Servicios</font></h1>
                            <a style="color: #ffffff; "><font color="#ffffff"> Punto de servicio:${this.clientSelected.Nombres} ${this.clientSelected.Apellidos}</font></a>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                        <table  cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" width="260" valign="top">
                                    <strong>Fecha inicio:</strong>fechainicio
                                </td>
                                <td align="center" width="260" valign="top">
                                   <strong>Fecha Final:</strong>fechafin
                                </td> 
                            </tr>
                            <tr>
                                <td align="center" width="260">
                                    <strong>Cantidad de domicilios:</strong> {totalpedidos}
                                </td>
                                <td align="center" width="260">
                                    <strong>Valor total de domicilios:</strong>TakeTarakeTake
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" width="100%">
                              <table cellpadding="0" cellspacing="0" width="100%" >
                                <thead>
                                    <tr>
                                        <th>Id solicitud</th>
                                        <th>Fecha</th>
                                        <th>Datos Cliente</th>
                                        <th>Tiempo Despacho</th>
                                        <th>Tiempo Finalización</th>
                                        <th>Tiempo Total</th>
                                        <th>Valor Domicilio</th>
                                        <th>Estado Domicilio</th>
                                        <th class="text-center">Domiciliario</th>
                                    </tr>
                                </thead>
        ` ;

    const s_finalizadas = this.solicitudes.filter(item => {
      if (item.key > this.dateStart && item.key < this.dateEnd && this.clientSelected.$key == item.payload.val().user_id){
        item['logs'] = this.logsSolicitudes[item.key]
        return item
      }
    })
    console.log("Finalizados:",s_finalizadas)
    totalpedidos = s_finalizadas.length;
    this.reporteHTML = this.reporteHTML.replace('{totalpedidos}', (totalpedidos+''));
    s_finalizadas.forEach(element => {
      let logs = '';
      console.log("datos",element);

      ValorDeDomicilios =  Number(ValorDeDomicilios) + Number(element.payload.val().TotalAPagar) ;
      //console.log("Total a pagar: "+element.payload.val().TotalAPagar)
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
        //logs+=`<li><strong>Tiempo Proceso a en proceso: ${fechachaDespachado}</strong> </li> `
        //logs+=`<li><strong>Tiempo Proceso a Despachado: ${fechaproceso} </strong> </li> `
        //logs+=`<li><strong>Fecha:  </strong> ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</li>`
        //logs+=`<li><strong>Estado:  </strong>${log.value.Estado}</li>`
        //logs+=`<li><strong>Mensajero Id: </strong> ${log.value.Motorratoner_id}</li>`
        
        
      });
      const date = new Date(Number(element.key));

      var diasDifdespacho=  fechachaDespachado.getTime() - fechaproceso.getTime();
      var diasDiffFinalizado=  FechaFinalizado.getTime() - fechachaDespachado.getTime();
      var totaltiempodespacho = Math.round(diasDifdespacho/(60*24*60));

      var totaltiempoFinalizado = Math.round(diasDiffFinalizado/(60*24*60));
      
      var sumatiempo = totaltiempodespacho+totaltiempoFinalizado;
      


      this.reporteHTML+=`
          <tbody>
            <td >${element.key}</td>
            <td > ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
            <td >${element.payload.val().Nombres} ${element.payload.val().Apellidos}</td>
            <td class="text-center">${totaltiempodespacho} Minutos</td>
            <td class="text-center">${totaltiempoFinalizado} Minutos</td>
            <td class="text-center">${sumatiempo} Minutos</td>
            <td class="text-center">${element.payload.val().TotalAPagar}</td>
            <td class="text-center">${element.payload.val().Estado}</td>
            <td class="text-center">${this.Mensajeros[element.payload.val().Motorratoner_id].Nombres} ${this.Mensajeros[element.payload.val().Motorratoner_id].Apellidos}</td>
          </tbody>
         `
    });
    
    this.reporteHTML+=`
    </table>
    </div>
</td>
</tr>
<tr>
<td  align="center" bgcolor="#f4511e" style="padding: 30px 30px 30px 30px;">
 Tu vuelta.co
</td>
</tr>
</table>
</body>
</html>
<br/>
    `

    this.reporteHTML = this.reporteHTML.replace('TakeTarakeTake',  (' $ '+ ValorDeDomicilios + ''));
    this.reporteHTML = this.reporteHTML.replace('fechainicio',  (' '+  fechainicio + ''));
    this.reporteHTML = this.reporteHTML.replace('fechafin',  (' '+ fechafin  + ''));
    
    console.log(ValorDeDomicilios)
    this.canSend = true;
  }
  public Mensajeros;
  loadMensajeros(){
    const Mensajero = ROLES.Mensajero;
    this.dbService.listUsersByRol(Mensajero).subscribe(_mensajeros => {
      this.Mensajeros = _mensajeros.reduce((o,val)=> {
        o[val.$key] = val
        return o;
      }, {})
      console.log(this.Mensajeros);
    })
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
      const url = 'https://us-central1-tuvuelta-produccion.cloudfunctions.net/api/reportes/enviar-mail';
    const body = {
      to: this.clientSelected.Correo,
      text: this.reporteHTML,
      subject: 'Reporte  de servicios TuVuelta.co'
    }
    const p = this.http.post(url, body, httpOptions).toPromise()
    }else {
      alert("El Cliente seleccionado no tiene correo registrado")
    }
    
    
  }
}
