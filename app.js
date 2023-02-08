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
app.use(express.urlencoded({encoded: false}));

// define middleware that logs all incoming requests
app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render("index");
} );

// read items - works
const read_timer_all_sql = `
    SELECT 
        id, task, estimated_time, description
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


// read item  - works
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


// delete - works
const delete_task_sql = `
    DELETE 
    FROM
        tasks
    WHERE
        id = ?
`

app.get("/timer/task/:id/delete", ( req, res ) => {
    db.execute(delete_task_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/timer");
        }
    });
})

// insert - works
const insert_task_sql = `
    INSERT INTO tasks
        (task, estimated_time)
    VALUES
        (?, ?)
`

app.post("/timer", (req, res) =>{
    db.execute(insert_task_sql, [req.body.taskName, req.body.minutes], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/timer");
        }
    });

});


// update - does not work
const update_task_sql = `
    UPDATE tasks
    SET
        task = ?
        estimated_time = ?
        description = ?
    WHERE 
        id = ?;
`

// app.post("/timer/task/:id")

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
});
