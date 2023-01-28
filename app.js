//set up the server
const express = require( "express" );
const app = express();
const port = 8080;
const logger = require("morgan");
const db = require('./db/db_connection');
let data;

// Configure Express to use EJS
app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );

// define middleware that logs all incoming requests
app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render("index");
} );

// define a route for the stuff inventory page
const read_timer_all_sql = `
    SELECT 
        id, task, estimated_time
    FROM
        tasks
`
app.get( "/timer", ( req, res ) => {
    db.execute(read_timer_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error); // Internal Server Error
        else
            res.render('timer', {tasks: results});
    });
});

// define a route for the item detail page
const read_task_sql = `
    SELECT 
        task, estimated_time, description 
    FROM
        tasks
    WHERE
        id = ?
`
app.get( "/timer/task/:id", ( req, res, next ) => {
    db.execute(read_task_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "${req.params.id}"` ); // NOT FOUND
        else
            data = results[0]; // results is still an array
            res.render('task', data);
    });
});

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
});
