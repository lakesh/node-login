
/**
 * Node.js Login Boilerplate
 * Author : Stephen Braitsch
 * More Info : http://bit.ly/LsODY8
 */

var exp = require('express');
var app = exp.createServer();
	
var conf = require('/Users/lakeshkansakar/clicker/node_modules/everyauth/example/conf')
var everyauth = require('everyauth');

everyauth.debug = true;

var usersById = {};
var nextUserId = 0;

function addUser (source, sourceUser) {
  var user;
  user = usersById[++nextUserId] = {id: nextUserId};
  user[source] = sourceUser;
  return user;
}

var usersByFbId = {};
var usersByTwitId = {};

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });

everyauth
  .facebook
    .appId(conf.fb.appId)
    .appSecret(conf.fb.appSecret)
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
      return usersByFbId[fbUserMetadata.id] || (usersByFbId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata));;
    })
    .redirectPath('/');

everyauth
  .twitter
    .consumerKey(conf.twit.consumerKey)
    .consumerSecret(conf.twit.consumerSecret)
    .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
      return usersByTwitId[twitUser.id] || (usersByTwitId[twitUser.id] = addUser('twitter', twitUser));;
    })
    .redirectPath('/');

app.root = __dirname;
global.host = 'local.host';

require('./app/config')(app, exp, everyauth);
require('./app/server/router')(app,everyauth);

app.listen(3000, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


var io = require('socket.io').listen(app);

var mongodb = require('mongodb');
var async = require('async');

io.sockets.on('connection', function (socket) {
	var currentTime = new Date().getTime();
	var startTime = currentTime - (10*60*1000);
	step = 60000;
	var values = new Array();
	var happy = new Array();
	var sad = new Array();
	var angry = new Array();
	var sleepy = new Array();
	
	var server1 = new mongodb.Server('localhost',27017, {auto_reconnect: true}, {safe:true});
	var db1 = new mongodb.Db('clicker', server1);	
	
	db1.open(function(err, db) {
		if(!err) {

			db1.collection('feedback', function(err, collection) {
				var queries = [];
				var END = 10;
				// Build up queries:
				for (var i=0;i <END; i++) {
					queries.push((function(j){
						return function(callback) {
							collection.find(
								{value:"1"},
								{created_on: 
									{       
										$gte:startTime + (j*60*1000 - 30*1000),
										$lt: startTime + (j*60*1000 + 30*1000)
									}
								},
								function(err_positive, result_happy) {
									result_happy.count(function(err, count){
										console.log("Total matches: " + count);
										happy[j] = count;          
										callback();
									});
								}
				
							);
						}
					})(i));
					queries.push((function(j){
						return function(callback) {
							collection.find(
								{value:"2"},
								{created_on: 
									{
										$gte:startTime + (j*60*1000 - 30*1000),
										$lt: startTime + (j*60*1000 + 30*1000)
									}
								},
								function(err_negative, result_sad) {
									result_sad.count(function(err, count){
										console.log("Total matches: " + count);
										sad[j] = count;
										callback();
									});
								}   
							);
						}
					})(i)); 
					queries.push((function(j){
						return function(callback) {
							collection.find(
								{value:"3"},
								{created_on: 
									{       
										$gte:startTime + (j*60*1000 - 30*1000),
										$lt: startTime + (j*60*1000 + 30*1000)
									}
								},
								function(err_positive, result_angry) {
									result_angry.count(function(err, count){
										console.log("Total matches: " + count);
										angry[j] = count;          
										callback();
									});
								}
				
							);
						}
					})(i)); 
					queries.push((function(j){
						return function(callback) {
							collection.find(
								{value:"4"},
								{created_on: 
									{       
										$gte:startTime + (j*60*1000 - 30*1000),
										$lt: startTime + (j*60*1000 + 30*1000)
									}
								},
								function(err_positive, result_sleepy) {
									result_sleepy.count(function(err, count){
										console.log("Total matches: " + count);
										sleepy[j] = count;          
										callback();
									});
								}
				
							);
						}
					})(i));
				}
				
				// Now execute the queries:
				async.parallel(queries, function(){
					// This function executes after all the queries have returned
					// So we have access to the completed positives and negatives:
				
					// For example, we can dump the arrays in Firebug:
					values[0] = happy[0];
					values[1] = sad[0];
					values[2] = angry[0];
					values[3] = sleepy[0];
					
					console.log(values);
					db1.close();
					socket.emit('initial', { stats: values }); 
				});
			});

		} else {
			console.log('Error connecting to the database');
		}      
	
	});

	socket.on('update', function (data) {
		console.log('Update request received');
		var currentTime = new Date().getTime();
		var server = new mongodb.Server('localhost',27017, {auto_reconnect: true}, {safe:true} );
		var db = new mongodb.Db('clicker', server);	
		var values = new Array();
		
		db.open(function(err, db) {
			if(!err) {
				db.collection('feedback', function(err, collection) {
					var queries = [];
					var END = 1;
					// Build up queries:
					for (var i=0;i <1; i++) {
						queries.push((function(j){
  						return function(callback) {
  							collection.find(
  								{value:"1"},
  								{created_on: 
  									{       
  										$gte:startTime + (j*60*1000 - 30*1000),
  										$lt: startTime + (j*60*1000 + 30*1000)
  									}
  								},
  								function(err_positive, result_happy) {
  									result_happy.count(function(err, count){
  										console.log("Total matches: " + count);
  										happy[j] = count;          
  										callback();
  									});
  								}

  							);
  						}
  					})(i));
  					
  					queries.push((function(j){
  						return function(callback) {
  							collection.find(
  								{value:"2"},
  								{created_on: 
  									{
  										$gte:startTime + (j*60*1000 - 30*1000),
  										$lt: startTime + (j*60*1000 + 30*1000)
  									}
  								},
  								function(err_negative, result_sad) {
  									result_sad.count(function(err, count){
  										console.log("Total matches: " + count);
  										sad[j] = count;
  										callback();
  									});
  								}   
  							);
  						}
  					})(i)); 
  					
  					queries.push((function(j){
  						return function(callback) {
  							collection.find(
  								{value:"3"},
  								{created_on: 
  									{       
  										$gte:startTime + (j*60*1000 - 30*1000),
  										$lt: startTime + (j*60*1000 + 30*1000)
  									}
  								},
  								function(err_positive, result_angry) {
  									result_angry.count(function(err, count){
  										console.log("Total matches: " + count);
  										angry[j] = count;          
  										callback();
  									});
  								}

  							);
  						}
  					})(i)); 
  					
  					queries.push((function(j){
  						return function(callback) {
  							collection.find(
  								{value:"4"},
  								{created_on: 
  									{       
  										$gte:startTime + (j*60*1000 - 30*1000),
  										$lt: startTime + (j*60*1000 + 30*1000)
  									}
  								},
  								function(err_positive, result_sleepy) {
  									result_sleepy.count(function(err, count){
  										console.log("Total matches: " + count);
  										sleepy[j] = count;          
  										callback();
  									});
  								}

  							);
  						}
  					})(i));
					}
					
					// Now execute the queries:
					async.parallel(queries, function(){
						// This function executes after all the queries have returned
						// So we have access to the completed positives and negatives:
					
						// For example, we can dump the arrays in Firebug:
  					values[0] = happy[0];
  					values[1] = sad[0];
  					values[2] = angry[0];
  					values[3] = sleepy[0];
						
						console.log(values);
						db.close();
						socket.emit('newstats', { stats: values }); 
					});
						
				});		

			}
		});
		
	}); 
});
everyauth.helpExpress(app);

console.log('Server running on 3000');
