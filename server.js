
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

// Return Facebook friends that sign up to the App
app.post('/json/friends', function (request, response) {
  var query = "SELECT `facebook_id` FROM  `" + database + "`.`mp_users` WHERE  `mp_users`.`facebook_id` IN (" + request.body.data + ")";
  connection.query(query, function (error, results, fields){
    if(error) throw error;
    
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(results), 'utf-8');
    response.end('\n');
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

          var query = "UPDATE `" + database + "`.`mp_users` SET `facebook_token` = ?, `facebook_expires` = ? WHERE `mp_users`.`facebook_id` = ?";
          var params = [data.access_token, data.expires, request.session.facebookid];
          connection.query(query, params, function (error, results, fields){
            if(error) throw error;

            // Populate Session
            request.session.token       = data.access_token;
            request.session.expires     = data.expires;

            var params = { access_token: data.access_token };

            // Get user location
            FB.api('me', params, function (data){

              request.session.location = data.location.name;

              // Return user session
              var session = JSON.stringify({
                user_id       : request.session.facebookid,
                access_token  : request.session.token,
                expires_at    : request.session.expires,
                user_location : request.session.location
              });

              response.writeHead(200, {'Content-Type': 'application/json'});
              response.write(session, 'utf-8');
              response.end();

            });

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
          var query = "INSERT INTO `" + database + "`.`mp_users`(`facebook_id`, `facebook_token`, `facebook_expires`) VALUES(?, ?, ?)";
          var params = [request.session.facebookid, request.session.token, request.session.expires];

          connection.query(query, params, function (error, results, fields){
            if(error) throw error;

            // Get user location
            FB.api('me', params, function (data){

              request.session.location = data.location.name;

              // Return user session
              var session = JSON.stringify({
                user_id       : request.session.facebookid,
                access_token  : request.session.token,
                expires_at    : request.session.expires,
                user_location : request.session.location
              });

              response.writeHead(200, {'Content-Type': 'application/json'});
              response.write(session, 'utf-8');
              response.end();
            });

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
    // Verify if access token is not invalid or expired
    var http = '/debug_token';
    var params = { input_token: request.session.token, access_token: APP_TOKEN };

    FB.api(http, params, function (json){
      // ***** If Access Token is not valid ***** //
      if(json.data.is_valid == false)
      {
        /***** CLIENT SIDE - Open Facebook Authentification Dialog *****/
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify({ action: 'authenticateWithFacebook' }), 'utf-8');
        response.end();
      }
      // ***** If Access Token is valid ***** //
      else
      {
        var session = JSON.stringify({
          user_id       : request.session.facebookid,
          access_token  : request.session.token,
          expires_at    : request.session.expires,
          user_location : request.session.location
        });

        // Return user session
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(session, 'utf-8');
        response.end();
      }
    });
  }

});

/* ==============================
          Helper Functions
   ============================== */

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
  var query = "SELECT * FROM `mp_users` WHERE `id_user` = " + connection.escape(request.params.user_id);
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
  var query = "SELECT * FROM `mp_pins` LEFT JOIN (`mp_users`, `mp_locations`, `mp_musics`) ON (`mp_users`.`facebook_id` = `mp_pins`.`user_pin` AND `mp_locations`.`id_location` = `mp_pins`.`location_pin` AND `mp_musics`.`id_music` = `mp_pins`.`music_pin`) WHERE `mp_users`.`facebook_id` = " + connection.escape(request.params.user);
  connection.query(query, function (error, results, fields){
    if(error) throw error;
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(results), 'utf-8');
    response.end('\n');
  });
});

// Retrieve all pins
app.get('/json/pins', function (request, response){
  var query = "SELECT * FROM `mp_pins` LEFT JOIN (`mp_users`, `mp_locations`, `mp_musics`) ON (`mp_users`.`facebook_id` = `mp_pins`.`user_pin` AND `mp_locations`.`id_location` = `mp_pins`.`location_pin` AND `mp_musics`.`id_music` = `mp_pins`.`music_pin`)";
  connection.query(query, function (error, results, fields){
    if(error) throw error;
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(results), 'utf-8');
    response.end('\n');
  });
});

// Retrieve existing pin
app.get('/json/pin/:pin_id', function (request, response){
  var query = "SELECT * FROM `mp_pins` WHERE `id_pin` = " + connection.escape(request.params.pin_id);
  connection.query(query, function (error, results, fields){
    if(error) throw error;
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(results), 'utf-8');
    response.end('\n');
  });
});

// Create new pin
app.post('/json/pin', function (request, response){
  var id_location;
  var latitude_location     = request.body.location_latitude;
  var longitude_location    = request.body.location_longitude;
  var reference_location    = request.body.location_reference;
  var description_location  = request.body.location_description;

  var id_music;
  var uri_music             = request.body.music_uri;

  var description_pin       = request.body.description;
  var user_pin              = request.body.user;

  console.log("user_pin: " + user_pin);  
  console.log("request.body.user: " + request.body.user);

  queryLocation();

  // Enter location in database: mp_locations
  // Or retrieve location identifier if location already exists
  function queryLocation() {
    connection.query("SELECT * FROM `mp_locations` WHERE `reference_location` = " + connection.escape(reference_location) + " LIMIT 0, 1", function (error, results){
      if(error) throw error;
      if(!results.length) {
        var connection = mysql.createConnection(options);
        var parameters = [latitude_location, longitude_location, reference_location, description_location];
        var query = "INSERT INTO `" + database + "`.`mp_locations`(`id_location`, `latitude_location`, `longitude_location`, `reference_location`, `description_location`) VALUES(NULL, ?, ?, ?, ?)";
        connection.query(query, parameters, function (error, results){
          if(error) throw error;
          id_location = results.insertId;
          console.log("Location successfully created in the database with id: " + id_location);
          queryMusic();
        });
      } else {
        id_location = results[0].id_location;
        console.log("Location exists in the database with id: " + id_location);
        queryMusic();
      }
    });
  };

  // Enter URI in database: mp_music
  // Or retrieve music identifier if music already exists
  function queryMusic() {
    connection.query("SELECT * FROM `mp_musics` WHERE `uri_music` = " + connection.escape(uri_music) + " LIMIT 0, 1", function (error, results){
      if(error) throw error;
      if(!results.length) {
        var connection = mysql.createConnection(options);
        connection.query("INSERT INTO `" + database + "`.`mp_musics`(`id_music`, `uri_music`) VALUES(NULL, " + connection.escape(uri_music) + ")", function (error, results){
          if(error) throw error;
          id_music = results.insertId;
          console.log("Music successfully created in the database with id: " + id_music);
          queryPin();
        });
      } else {
        id_music = results[0].id_music;
        console.log("Music exists in the database with id: " + id_music);
        queryPin();
      }
    });
  };

  // Terminate MySQL connection to execute location and music queries
  function queryPin() {
    var parameters = [description_pin, user_pin, id_location, id_music];
    var query = "INSERT INTO `" + database + "`.`mp_pins`(`id_pin`, `description_pin`, `user_pin`, `location_pin`, `music_pin`) VALUES(NULL, ?, ?, ?, ?)";
    connection.query(query, parameters, function (error, results){
      if(error) throw error;
      console.log("Pin successfully created in the database with user id: " + user_pin);
    });
  }

  response.writeHead(200, {'Content-Type': 'application/json'});
  response.write('', 'utf-8');
  response.end('\n');

});