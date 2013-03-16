
/*
 * Module dependencies.
 */

var express   = require('express');
var mysql     = require('mysql');
var fs        = require('fs');

// NodeJS Library for Facebook. More at https://github.com/Thuzi/facebook-node-sdk.
var FB        = require('fb');

var app = express();
app.listen(3000);

/*
 * Facebook credentials.
 */

var APP_ID      = 476683619043995;
var APP_SECRET  = '005288b1a846a66b3393554404c73472';
var APP_TOKEN   = '476683619043995|IYHycM4RaQcOok4KpyCnXIFuTSI';
FB.setAccessToken(APP_TOKEN);

/*
 * Configuration.
 */

var secret = '18N320e5V8';

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: secret, cookie: { maxAge: 1000 * 60 * 60 } })); // Expires +1 hours
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
  
  // If RESTful API related HTTP Request
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

// Logout user from Facebook account
app.post('/json/logout', function (request, response) {

  // Delete user permissions
  var http = request.session.facebookid + '/permissions';
  FB.api(http, 'delete', function (data) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(data), 'utf-8');
    response.end();

    // Delete session
    request.session.destroy();
  });

});

app.post('/json/login', function (request, response) {

  // Get Facebook credentials from Access Token
  var http = '/debug_token';
  var params = { input_token: request.body.token, access_token: APP_TOKEN };

  FB.api(http, params, function (data){
    // Populate Session
    request.session.facebookid = data.data.user_id;

    // Verify if Facebook User ID exists in the database
    var query = "SELECT * FROM `" + database + "`.`mp_users` WHERE `mp_users`.`facebook_id` = ?";
    var params = [request.session.facebookid];

    connection.query(query, params, function (error, results, fields){
      if(error) throw error;

      // ===== If Facebook User ID exists ===== //
      if(results.length != 0){

        var http = '/oauth/access_token';
        var params = { grant_type: 'fb_exchange_token', client_id: APP_ID, client_secret: APP_SECRET, fb_exchange_token: request.body.token };

        FB.api(http, params, function (data){

          var query = "UPDATE `" + database + "`.`mp_users` SET `token` = ?, `expires` = ? WHERE `mp_users`.`facebook_id` = ?";
          var params = [data.access_token, data.expires, request.session.facebookid];
          connection.query(query, params, function (error, results, fields){
            if(error) throw error;

            // Populate Session
            request.session.token       = data.access_token;
            request.session.expires     = data.expires;

            // Return user session
            var session = JSON.stringify({
              user_id       : request.session.facebookid,
              access_token  : request.session.token,
              expires_at    : request.session.expires
            });
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(session, 'utf-8');
            response.end();
          });
        });
      }
      // ===== If Facebook User ID does not exist ===== //
      else {

        // Get longer-lived Access Token
        var http = '/oauth/access_token';
        var params = { grant_type: 'fb_exchange_token', client_id: APP_ID, client_secret: APP_SECRET, fb_exchange_token: request.body.token };

        FB.api(http, params, function (data){

          // Populate session
          request.session.token       = data.access_token
          request.session.expires     = data.expires;

          // Insert new user in the database
          var query = "INSERT INTO `" + database + "`.`mp_users`(`facebook_id`, `token`, `expires`) VALUES(?, ?, ?)";
          var params = [request.session.facebookid, request.session.token, request.session.expires];

          connection.query(query, params, function (error, results, fields){
            if(error) throw error;

            // Return user session
            var session = JSON.stringify({
              user_id       : request.session.facebookid,
              access_token  : request.session.token,
              expires_at    : request.session.expires
            });
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(session, 'utf-8');
            response.end();
          });

        });
      }

    });

  });

});

app.post('/json/session/user', function (request, response) {

  // ===== If user session does not exist ===== //
  if(request.session.facebookid == null) {

    /***** CLIENT SIDE - Open Facebook Authentification Dialog *****/
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify({ action: 'authenticateWithFacebook' }), 'utf-8');
    response.end();
  }
  // ===== If user session exists ===== //
  else {
    // Return user session
    var session = JSON.stringify({
      user_id       : request.session.facebookid,
      access_token  : request.session.token,
      expires_at    : request.session.expires
    });
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(session, 'utf-8');
    response.end();
  }

});

/* ==============================
          Helper Functions
   ============================== */

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


// ===== PINS ===== //

// Return pin from user parameter - Facebook ID
app.get('/json/pins/:user', function (request, response){
  var query = "SELECT * FROM `mp_pins` LEFT JOIN (`mp_users`, `mp_locations`, `mp_musics`) ON (`mp_users`.`facebook_id` = `mp_pins`.`user_id` AND `mp_locations`.`id` = `mp_pins`.`location_id` AND `mp_musics`.`id` = `mp_pins`.`music_id`) WHERE `mp_users`.`facebook_id` = " + connection.escape(request.params.user);
  connection.query(query, function (error, results, fields){
    if(error) throw error;
    console.log(results);
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(results), 'utf-8');
    response.end('\n');
  });
});

// Retrieve all pins
app.get('/json/pins', function (request, response){
  var query = "SELECT * FROM `mp_pins` LEFT JOIN (`mp_users`, `mp_locations`, `mp_musics`) ON (`mp_users`.`facebook_id` = `mp_pins`.`user_id` AND `mp_locations`.`id` = `mp_pins`.`location_id` AND `mp_musics`.`id` = `mp_pins`.`music_id`)";
  connection.query(query, function (error, results, fields){
    if(error) throw error;
    console.log(results);
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