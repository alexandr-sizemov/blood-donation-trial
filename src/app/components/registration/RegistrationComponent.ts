import { Component } from 'angular2/core';
import { CORE_DIRECTIVES, Control, Validators, FormBuilder } from 'angular2/common';
import { RouterLink, RouteParams } from 'angular2/router';
import { Donor } from './Donor';
import { SocketService } from '../../shared/services/SocketService';
import * as _ from 'lodash';

@Component({
  selector: 'registration',
  templateUrl: 'app/components/registration/registrationComponent.html',
  directives: [CORE_DIRECTIVES, RouterLink]
})
export class RegistrationComponent {
  bloodGroup = ['A', 'B', 'AB', '0'];
  submitted = false;
  active = true;
  userId: string;
  // model = new Donor('Cicci', 'Princi', '3406907329', 'alexandr-sizemov@gmail.com', this.bloodGroup[0]);
  model = new Donor();
  constructor(private _socketService: SocketService) { }

  onRegister() {
    this._socketService.registerDonor(this.model);
  }

  onDelete(){
    this._socketService.deleteDonor(this.model._id);
  }

  onUpdate(){
    this._socketService.updateDonor(this.model);
  }


  onUpdateDonorComplete(updateDonorResponse: any) { 
    console.log('updateDonor complete');
  }

  onDeleteDonorComplete(deleteDonorResponse: any) { 
    console.log('deleteDonor complete');
  }

  onGetDonorComplete(getDonorResponse: any){
    console.log('getUser complete');
    if( getDonorResponse.status === 'complete'){
      this.model = getDonorResponse.donor;
    }
  }

  onRegistrationComplete(registrationResponse: string){
    console.log('reg complete');
    if( registrationResponse.status === 'complete'){
      this.submitted = true;
      this.active = false;
      this.model.userId = registrationResponse.donorId;
      this.userId = registrationResponse.donorId;
    }
  }

  ngOnInit() {
    this._socketService.subscribe('registerDonor', _.bind(this.onRegistrationComplete, this));
    this._socketService.subscribe('updateDonor', _.bind(this.onUpdateDonorComplete, this));
    this._socketService.subscribe('deleteDonor', _.bind(this.onDeleteDonorComplete, this));
    this._socketService.subscribe('getDonor', _.bind(this.onGetDonorComplete, this));
  }
}
