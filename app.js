//set up the server
const express = require( "express" );
const app = express();
const port = 8080;
const logger = require("morgan");

// define middleware that logs all incoming requests
app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.sendFile( __dirname + "/views/index.html" );
} );

// define a route for the stuff inventory page
app.get( "/timer", ( req, res ) => {
    res.sendFile( __dirname + "/views/timer.html" );
} );

// define a route for the item detail page
app.get( "/timer/task", ( req, res ) => {
    res.sendFile( __dirname + "/views/task.html" );
} );

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );