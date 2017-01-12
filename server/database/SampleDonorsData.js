var MongoConfig = require('../config');
var _ = require('lodash');
var q = require('q');
var Donor = require('../models/Donor');

var SampleDonorsData = function(){
	
}

SampleDonorsData.prototype.load = function(db, collections) {
	db.collection('donors').insert(new Donor(),function (err, result) {});
};

module.exports = SampleDonorsData;