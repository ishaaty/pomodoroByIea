const port = process.env.PORT || 8080;

const helmet = require("helmet");
const express = require( "express" );
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const logger = require("morgan");
const dotenv = require('dotenv');
const db = require('./db/db_pool');
const app = express();

dotenv.config();

app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );
app.use(express.urlencoded({encoded: false}));
app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));

let data;

app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'cdnjs.cloudflare.com']
      }
    }
  })); 

  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
  };
  

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.oidc.isAuthenticated();
    res.locals.user = req.oidc.user;
    next();
})
  
// req.isAuthenticated is provided from the auth router
app.get('/authtest', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.render('profile');
    // res.render('profile', {profile : req.oidc.user});
    console.log(JSON.stringify(req.oidc.user));
});

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render("index");
});

// read items - works
const read_timer_all_sql = `
    SELECT 
        id, task, estimated_time, description
    FROM
        tasks
    WHERE
        email = ?
`

app.get( "/timer", requiresAuth(), ( req, res ) => {
    db.execute(read_timer_all_sql, [req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error); // Internal Server Error
        else
            res.render('timer', {tasks: results});
    });
});


// read item  - works
const read_task_sql = `
    SELECT 
        id, task, estimated_time, description 
    FROM
        tasks
    WHERE
        id = ?
    AND
        email = ?
`

app.get( "/timer/task/:id", requiresAuth(), ( req, res, next ) => {
    db.execute(read_task_sql, [req.params.id, req.oidc.user.email], (error, results) => {
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
    AND
        email = ?
`

app.get("/timer/task/:id/delete", requiresAuth(), ( req, res ) => {
    db.execute(delete_task_sql, [req.params.id, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/timer");
        }
    });
})

// insert - works
const create_task_sql = `
    INSERT INTO tasks
        (task, estimated_time, email)
    VALUES
        (?, ?, ?)
`

app.post("/timer", requiresAuth(), (req, res) =>{
    db.execute(create_task_sql, [req.body.taskName, req.body.minutes, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/timer");
        }
    });

});


// update - works T.T
const update_task_sql = `
    UPDATE 
        tasks
    SET
        task = ?,
        estimated_time = ?,
        description = ?
    WHERE 
        id = ?
    AND 
        email = ?
`

app.post("/timer/task/:id", requiresAuth(), ( req, res ) => {
    db.execute(update_task_sql, [req.body.taskName, req.body.minutes, req.body.description, req.params.id, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/timer/task/${req.params.id}`);
        }
    });
})

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
})
