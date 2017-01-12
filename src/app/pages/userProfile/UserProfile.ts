import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { RouterLink, RouteParams } from 'angular2/router';
import { SocketService } from '../../shared/services/SocketService';
import { RegistrationComponent } from '../../components/registration/RegistrationComponent';

@Component({
  selector: 'user-profile',
  templateUrl: 'app/pages/userProfile/userProfile.html',
  directives: [CORE_DIRECTIVES, RouterLink, RegistrationComponent]
})
export class UserProfile {

  constructor(private socketService: SocketService, private routeParams: RouteParams) { }
  ngOnInit() {
    let donorId = this.routeParams.get('id');
    this.socketService.getDonor(donorId);
  }
}
