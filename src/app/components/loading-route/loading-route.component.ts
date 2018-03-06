import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, RoutesRecognized, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/do'
@Component({
  selector: 'app-loading-route',
  templateUrl: './loading-route.component.html',
  styleUrls: ['./loading-route.component.css']
})
export class LoadingRouteComponent implements OnInit {

  loading$: Observable<boolean>;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.loading$ = this.router.events.map(event => 
      event instanceof NavigationEnd)
    
      
  }

}
