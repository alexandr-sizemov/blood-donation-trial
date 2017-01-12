var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var MongoConfig = require('../config');
var SampleDonorsData = require('./SampleDonorsData');
var _ = require('lodash');
var q = require('q');

var MongoDB = function(){
	this.db = null;
	this.collections = [];
	
	MongoClient.connect(MongoConfig.dbUrl, _.bind(function(err, db) {
	  if(!err) {
	    console.log("We are connected");
	  	this.db = db;
		this.bootstrap();
	  }
	},this));
}

MongoDB.prototype.bootstrap = function() {
	console.log('initialize database...');
	MongoConfig.collections.forEach(_.bind(function (collectionName) {
		this.db.createCollection(collectionName, _.bind(function(err, collection) {
			if(!err){
				this.collections[collectionName] = collection;
				console.log(' ', collectionName, ' collection created');
			}else{
				console.log(' ', collectionName, ' collection failed');
			}
		},this));
	},this));

	// var sampleDonorsData = new SampleDonorsData();
	// sampleDonorsData.load(this.db, this.collections);
};

MongoDB.prototype.addDonor = function(donordata) {
	console.log('addDonor db');
	var defer = q.defer();
	this.db.collection('donors').insert(donordata,function (err, result) {
		if(!err){
			defer.resolve(result.insertedIds[0]);
		}else{
			defer.reject(err);
		}
	});
	return defer.promise;
};

MongoDB.prototype.updateDonor = function(donordata) {
	console.log('updateDonor db');
	var defer = q.defer();
	var updateObj = {
		firstName: donordata.firstName,
		lastName: donordata.lastName,
		lastName: donordata.lastName,
		telephone: donordata.telephone,
		email: donordata.email,
		bloodGroup: donordata.bloodGroup
	}
	this.db.collection('donors').update(
		{"_id": new ObjectID(donordata._id)},
		{$set: updateObj},
		function (err, result) {
		if(!err){
			console.log('donor updated', result);
			defer.resolve(result);
		}else{
			console.log('donor error', result);
			defer.reject(err);
		}
	});
	return defer.promise;
};

MongoDB.prototype.getDonor = function(donorId) {
	console.log('get db ', donorId);
	var defer = q.defer();
	this.db.collection('donors').find({"_id": new ObjectID(donorId)}).toArray(
		function (err, result) {
		if(!err){
			console.log(' got', result[0]);
			defer.resolve(result[0]);
		}else{
			defer.reject(err);
		}
	});
	return defer.promise;
};

MongoDB.prototype.deleteDonor = function(donorId) {
	console.log('delete db');
	var defer = q.defer();
	this.db.collection('donors').remove(
		{"_id": new ObjectID(donorId)},
		function (err, result) {
		if(!err){
			console.log(' delete', result);
			defer.resolve(result[0]);
		}else{
			defer.reject(err);
		}
	});
	return defer.promise;

};

MongoDB.prototype.getUsers = function(donordata) {
	console.log('register db');	

};

module.exports = MongoDB;