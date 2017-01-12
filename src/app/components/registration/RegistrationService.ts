import { Inject } from 'angular2/core';
import { Injectable } from 'angular2/core';
import { SocketService } from '../../shared/services/SocketService';

@Injectable()
export class RegistrationService {

    constructor( @Inject(SocketService) private _socketService: SocketService) {
    }

    register(donormodel) {
        var data = JSON.stringify(donormodel);
        this._socketService.emit('register', data);
    }

}