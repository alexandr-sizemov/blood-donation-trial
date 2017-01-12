import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig } from 'angular2/router';
import { SocketService } from './shared/services/SocketService';
import { UserProfile } from './pages/userProfile/UserProfile';
import { HomePage } from './pages/home/home';

@Component({ 
  selector: 'app-container',
  providers: [SocketService],
  template: `<router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES],
})
@RouteConfig([
  { path: '/', as: 'Customers', component: HomePage, useAsDefault: true },
  { path: '/user/:id', as: 'UserProfile', component: UserProfile }
])
export class AppComponent {
  
  constructor() {

  }
  
}
