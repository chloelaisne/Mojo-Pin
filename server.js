
/*
 * Module dependencies.
 */

var express = require('express')
  , mysql = require ('mysql')
  , fs = require('fs')
  , events = require('events')
  , mongoose = require('mongoose');

var app = express();
app.listen(3000);

/*
 * Configuration.
 */

var secret = '18N320e5V8';

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: secret, cookie: { maxAge: 1000 * 60 * 60 * 24 } })); // Expires +24 hours
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/javascripts', express.static(__dirname + '/public/javascripts'));
app.use('/stylesheets', express.static(__dirname + '/public/stylesheets'));

/*
 * Database.
 */

var host      = 'localhost';
var user      = 'root';
var password  = 'password';
var database  = 'mojopin_development';
var options   = {
  host:     host,
  user:     user,
  password: password,
  database: database
};
var connection = mysql.createConnection(options);

/*
 * Routes.
 */

app.get('*', function (request, response, next){
  console.log(JSON.stringify(request.session));
  if(typeof request.session.id == 'undefined') request.session.id = 1;
  if(request.url.indexOf('/json') == 0) return next();
  fs.readFile(__dirname + '/index.html', 'utf8', function (error, data){
    if(error) throw error;
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(data, 'utf-8');
  });
});

/* ==================================================
   ==================== SESSION
   ================================================== */

app.get('/json/session/pin', function (request, response) {
  if(typeof request.session != 'undefined') {
    response.writeHead(200, { 'Content-type': 'application/json' });
    response.write(JSON.stringify(request.session), 'utf-8');
    response.end('\n');
  }
});

app.post('/json/session/pin', function (request, response) {
  if(request.body.music != 'undefined' && request.body.music != null)
    request.session.music = request.body.music;
  else if(request.body.location != 'undefined' && request.body.location != null)
    request.session.location = request.body.location;
  else if(request.body.description != 'undefined' && request.body.description != null)
    request.session.description = request.body.description;

  response.writeHead(200, { 'Content-type': 'application/json' });
  response.end();
});

app.del('/json/session/pin', function (request, response) {
  if(typeof request.body.music != 'undefined')
  {
    request.session.music = null;
  }
  else
  {
    if(request.session.music != 'undefined' && request.session.music != null)
      request.session.music = null;
    if(request.session.location != 'undefined' && request.session.location != null)
      request.session.location = null;
    if(request.session.description != 'undefined' && request.session.description != null)
      request.session.description = null;
  }
  
  response.writeHead(200, { 'Content-type': 'application/json' });
  response.end();
});

// ===== USERS ===== //

// Retrieve all users
app.get('/json/users', function (request, response){
  var query = "SELECT * FROM `mp_users`";
  connection.query(query, function (error, results, fields){
    if(error) throw error;
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(results), 'utf-8');
    response.end('\n');
  });
});

// Retrieve defined user
app.get('/json/user/:user_id', function (request, response){
  var query = "SELECT * FROM `mp_users` WHERE `id` = " + connection.escape(request.params.user_id);
  connection.query(query, function (error, results, fields){
    if(error) throw error;
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(results), 'utf-8');
    response.end('\n');
  });
});

// Facebook Authentification
app.post('/json/facebookauth', function (request, response){
  var query = "SELECT * FROM `" + database + "`.`mp_users` WHERE `mp_users`.`user` = ?";
  connection.query(query, [request.body.user], function (error, results, fields){
    if(error) throw error;
    if(results && results.length == 1){
      if(results[0].token == request.body.token){
        var query = "UPDATE `" + database + "`.`mp_users` SET `token` = ? WHERE `mp_users`.`user` = ?";
        connection.query(query, [request.body.token, request.body.user], function (error, results, fields){
          if(error) throw error;
          response.writeHead(200, {'Content-Type': 'application/json'});
          response.write(JSON.stringify(results), 'utf-8');
          response.end('\n');
        });
      }
      else{
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify(results), 'utf-8');
        response.end('\n');
      }
    }
    else{
      var query = "INSERT INTO `" + database + "`.`mp_users`(`id`, `user`, `token`) VALUES(NULL, ?, ?)";
      connection.query(query, [request.body.user, request.body.token], function (error, results, fields){
        if(error) throw error;
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify(results), 'utf-8');
        response.end('\n');
      });
    }
  }); 
});

// Update token
app.put('/json/facebookauth', function (request, response){
  var params = [request.body.token, request.body.id];
  var query = "UPDATE `" + database + "`.`mp_users` SET `token` = '?' WHERE `mp_users`.`id` = ?";
  connection.query(query, params, function (error, results, fields){
    if(error) throw error;
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(results), 'utf-8');
    response.end('\n');
  });
});

// ===== PINS ===== //

// Retrieve all pins
app.get('/json/pins', function (request, response){
  var query = "SELECT * FROM `mp_pins` LEFT JOIN (`mp_users`, `mp_locations`, `mp_musics`) ON (`mp_users`.id = `mp_pins`.user_id AND `mp_locations`.id = `mp_pins`.location_id AND `mp_musics`.id = `mp_pins`.music_id)";
  connection.query(query, function (error, results, fields){
    if(error) throw error;
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(results), 'utf-8');
    response.end('\n');
  });
});

// Retrieve existing pin
app.get('/json/pin/:pin_id', function (request, response){
  var query = "SELECT * FROM `mp_pins` WHERE `id` = " + connection.escape(request.params.pin_id);
  connection.query(query, function (error, results, fields){
    if(error) throw error;
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(results), 'utf-8');
    response.end('\n');
  });
});

// Create new pin
app.post('/json/pin', function (request, response){

  var location_id   = null;
  var music_id      = null;

  // Enter location in database: mp_locations
  // Or retrieve location identifier if location already exists
  connection.query("SELECT * FROM `mp_locations` WHERE `reference` = '" + request.body.reference + "' LIMIT 0, 1", function (error, results){
    if(error) throw error;
    if(!results.length){
      var parameters = [request.body.location_latitude, request.body.location_longitude, request.body.location_reference, request.body.location_description];
      var query = "INSERT INTO `" + database + "`.`mp_locations`(`id`, `latitude`, `longitude`, `reference`, `description`) VALUES(NULL, ?, ?, ?, ?)";
      connection.query(query, parameters, function (error, results){
        if(error) throw error;
        location_id = results.insertId;
        console.log('Location entry inserted successfully in the database: ' + request.body.description);
      });
    } else{
      console.log('Location entry already exists in the database: ' + request.body.latlng);
      location_id = results[0].id;
    }
  });

  // Enter URI in database: mp_music
  // Or retrieve music identifier if music already exists
  connection.query("SELECT * FROM `mp_music` WHERE `uri` = '" + request.body.music_uri + "' LIMIT 0, 1", function (error, results){
    if(error) throw error;
    if(!results.length){
      connection.query("INSERT INTO `" + database + "`.`mp_musics`(`id`, `uri`) VALUES(NULL, '" + request.body.music_uri + "')", function (error, results){
        if(error) throw error;
        music_id = results.insertId;
        console.log('Music entry inserted successfully in the database: ' + request.body.music_uri);
      });
    } else{
      console.log('Music entry already exists in the database: ' + request.body.music_uri);
      music_id = results[0].id;
    }
  });

  // Terminate MySQL connection to execute location and music queries
  connection.end(function(){
    // Restart the mySQL connection
    connection = mysql.createConnection({
      host:     host,
      user:     user,
      password: password,
      database: database
    });
    // Enter pin entry in database: mp_pins
    var parameters = [request.body.description, user_id, location_id, music_id];
    var query = "INSERT INTO `" + database + "`.`mp_pins`(`id`, `description`, `user_id`, `location_id`, `music_id`) VALUES(NULL, ?, ?, ?, ?)";
    connection.query(query, parameters, function (error, results){
      if(error) throw error;
      console.log('Pin entry inserted successfully in the database: ');
    });
  });

  response.writeHead(200, {'Content-Type': 'application/json'});
  response.write('', 'utf-8');
  response.end('\n');

});