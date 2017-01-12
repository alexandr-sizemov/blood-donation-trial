import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import * as _ from 'lodash';

@Injectable()
export class SocketService {

    private socketEventCollections$: Array<Observable<Array<string>>>;
    private collectionObserver: Array<any>;
    private _collection: any;
    private events = new Array(
        'registerDonor',
        'getDonor',
        'updateDonor',
        'deleteDonor');
    static url: 'http://127.0.0.1:3000';
    private socket: any;

    constructor() {
        var that = this;
        this.socket = io(this.url);
        this.socket.on('connect', _.bind(function(data) {
            console.log('connected...');
            this.registerSocketListeners();
        },this));
        this._collection = new Array();
        
        this.socketEventCollections$ = {};
        this.collectionObserver = {};
        this.events.forEach(_.bind( function (event) {
            this.socketEventCollections$[event] = new Observable(_.bind( observer => {
                this.collectionObserver[event] = observer;
            },this)).share();

        },this));
    }

    subscribe(event, callback){
        this.socketEventCollections$[event].subscribe(callback);
    }

    // add(value: string) {
    //     this._collection.push(value);
    //     this._collectionObserver.next(this._collection);
    // }

    // load() {
    //     this._collectionObserver.next(this._collection);
    // }

    registerSocketListeners(){
        this.socket.on('registerDonor', _.bind(registrationResponse => {
            console.log('registration status', registrationResponse);
            this.collectionObserver['registerDonor'].next( registrationResponse );
        },this));

        this.socket.on('getDonor', _.bind(getDonorResponse => {
            console.log('getDonor', getDonorResponse);
            this.collectionObserver['getDonor'].next( getDonorResponse );
        },this));

        this.socket.on('updateDonor', _.bind(updateDonorResponse => {
            console.log('updateDonor', updateDonorResponse);
            this.collectionObserver['updateDonor'].next(updateDonorResponse);
        },this));

        this.socket.on('deleteDonor', _.bind(deleteDonorResponse => {
            console.log('deleteDonor', deleteDonorResponse);
            this.collectionObserver['deleteDonor'].next(deleteDonorResponse);
        },this));

    }

    registerDonor(donor : Donor) {
        console.log('registerDonor:',donor);
        this.socket.emit('registerDonor', donor);
    }

    deleteDonor(donorId: string) {
        console.log('deleteDonor:', donorId);
        this.socket.emit('deleteDonor', { donorId: donorId });
    }

    getDonor(donorId : string) {
        console.log('getDonor:', donorId);
        this.socket.emit('getDonor', {donorId: donorId});
    }

    updateDonor(donor : string) {
        console.log('updateDonor:', donor);
        this.socket.emit('updateDonor', donor);
    }

}