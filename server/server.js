var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var MongoDB = require('./database/MongoDB');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);
var mongoDB = new MongoDB();

router.use(express.static(path.resolve(__dirname, '../src')));
var messages = [];
var sockets = [];
var ipAddress = null;

io.on('connection', function (socket) {
	ipAddress = socket.request.connection.remoteAddress;

	socket.on('registerDonor', function(donordata){
	  	console.log('register:', donordata);
	  	donordata.ip = ipAddress;
	  	mongoDB.addDonor(donordata)
	  		.then(function (donorId) {
	  			console.log('emit register ok:', donorId);
	    		socket.emit('registerDonor', {status:'complete', donorId:donorId });
	  		})
	  		.catch(function (err) {
	  			console.log('emit register ko');
	  			socket.emit('registerDonor', {status:'error'});
	  		});
	});

	socket.on('getDonor', function(donor){
	  	console.log('get:',donor.donorId);
	  	mongoDB.getDonor(donor.donorId)
	  		.then(function (donor) {
	  			console.log('emit getDonor ok:', donor);
	    		socket.emit('getDonor', {status:'complete', donor:donor });
	  		})
	  		.catch(function (err) {
	  			console.log('emit getDonor ko');
	  			socket.emit('getDonor', {status:'error'});
	  		});
	});

	socket.on('updateDonor', function(donor){
	  	console.log('update:', donor);
	  	mongoDB.updateDonor(donor)
	  		.then(function (donor) {
	  			console.log('emit updateDonor ok:', donor);
	    		socket.emit('updateDonor', {status:'complete', donor:donor });
	  		})
	  		.catch(function (err) {
	  			console.log('emit updateDonor ko');
	  			socket.emit('updateDonor', {status:'error'});
	  		});
	});

	socket.on('deleteDonor', function(donorId){
	  	console.log('delete:',donorId);
	  	mongoDB.deleteDonor(donorId)
	  		.then(function (donor) {
	  			console.log('emit deleteDonor ok:', donor);
	    		socket.emit('deleteDonor', {status:'complete', donor:donor });
	  		})
	  		.catch(function (err) {
	  			console.log('emit deleteDonor ko');
	  			socket.emit('deleteDonor', {status:'error'});
	  		});
	});

//     messages.forEach(function (data) {
//       socket.emit('message', data);
//     });

//     sockets.push(socket);

//     socket.on('disconnect', function () {
//       sockets.splice(sockets.indexOf(socket), 1);
//       updateRoster();
//     });

//     socket.on('message', function (msg) {
//       var text = String(msg || '');

//       if (!text)
//         return;

//       socket.get('name', function (err, name) {
//         var data = {
//           name: name,
//           text: text
//         };

//         broadcast('message', data);
//         messages.push(data);
//       });
//     });

//     socket.on('identify', function (name) {
//       socket.set('name', String(name || 'Anonymous'), function (err) {
//         updateRoster();
//       });
//     });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "localhost", function(){
  var addr = server.address();
  console.log("Crossover blood donation listen at ", addr.address + ":" + addr.port);
});
