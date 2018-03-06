import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent implements OnInit {
  ngOnInit(){
    console.log('Iniciando authlayout')
  }
}
