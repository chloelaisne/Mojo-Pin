
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
var store = new express.session.MemoryStore;

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: secret, store: store}));
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
  if(typeof request.session.id == 'undefined') request.session.id = 1;
  if(request.url.indexOf('/json') == 0) return next();
  fs.readFile(__dirname + '/index.html', 'utf8', function (error, data){
    if(error) throw error;
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(data, 'utf-8');
  });
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
  var query = "SELECT * FROM `mp_pins` LEFT JOIN (`mp_users`, `mp_locations`, `mp_tracks`) ON (`mp_users`.id = `mp_pins`.user_id AND `mp_locations`.id = `mp_pins`.location_id AND `mp_tracks`.id = `mp_pins`.uri_id)";
  connection.query(query, function (error, results, fields){
    if(error) throw error;
    console.log(JSON.stringify(results));
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(results), 'utf-8');
    response.end('\n');
  });
});

// Retrieve defined pin
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
app.get('/json/pin/:type/:latlng/:uri/:caption', function (request, response){

  var user_id = 1;
  var location_id = null;
  var uri_id = null;
  var type = null;
  if(request.params.type == 'playlist')
    type = 'mp_playlists';
  else if(request.params.type == 'track')
    type = 'mp_tracks';

  // Enter location in the database: mp_locations
  // Or retrieve location identifier if location already exists
  connection.query("SELECT * FROM `mp_locations` WHERE `latlng` = '" + request.params.latlng + "' LIMIT 0, 1", function (error, results){
    if(error) throw error;
    if(!results.length){
      connection.query("INSERT INTO `" + database + "`.`mp_locations`(`id`, `latlng`) VALUES(NULL, '" + request.params.latlng + "')", function (error, results){
        if(error) throw error;
        location_id = results.insertId;
        console.log('Location entry inserted successfully in the database: ' + request.params.latlng);
      });
    } else{
      console.log('Location entry already exists in the database: ' + request.params.latlng);
      location_id = results[0].id;
    }
  });

  // Enter URI in the database: mp_tracks or mp_playlists
  // Or retrieve URI identifier if URI already exists
  connection.query("SELECT * FROM `" + type + "` WHERE `spotify_uri` = '" + request.params.uri + "' LIMIT 0, 1", function (error, results){
    if(error) throw error;
    if(!results.length){
      connection.query("INSERT INTO `" + database + "`.`" + type + "`(`id`, `spotify_uri`) VALUES(NULL, '" + request.params.uri + "')", function (error, results){
        if(error) throw error;
        uri_id = results.insertId;
        console.log(request.params.type + ' entry inserted successfully in the database: ' + request.params.uri);
      });
    } else{
      console.log(request.params.type + ' entry already exists in the database: ' + request.params.uri);
      uri_id = results[0].id;
    }
  });

  // Location and URI queries executed and mySQL connection terminated
  connection.end(function(){
    // Restart the mySQL connection
    connection = mysql.createConnection({
      host:     host,
      user:     user,
      password: password,
      database: database
    });
    // Enter pin entry in the database: mp_pins
    var parameters = [request.params.type, request.params.caption, user_id, location_id, uri_id];
    var query = "INSERT INTO `" + database + "`.`mp_pins`(`id`, `type`, `caption`, `user_id`, `location_id`, `uri_id`) VALUES(NULL, ?, ?, ?, ?, ?)";
    connection.query(query, parameters, function (error, results){
      if(error) throw error;
      console.log('Pin entry inserted successfully in the database: ');
    });
  });

  response.writeHead(200, {'Content-Type': 'application/json'});
  response.write('', 'utf-8');
  response.end('\n');

});