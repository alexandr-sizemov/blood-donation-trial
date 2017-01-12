import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { RouterLink } from 'angular2/router';
import { MapComponent } from '../../components/map/MapComponent';
import { RegistrationComponent } from '../../components/registration/RegistrationComponent';

@Component({
  selector: 'home',
  templateUrl: 'app/pages/home/home.html',
  directives: [CORE_DIRECTIVES, RouterLink, MapComponent, RegistrationComponent]
})
export class HomePage {

  constructor() { }

}
