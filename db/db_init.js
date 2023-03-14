// (Re)Sets up the database, including a little bit of sample data
const db = require("./db_connection");

/**** Delete existing table, if any ****/

const drop_task_table_sql = "DROP TABLE IF EXISTS `tasks`;"

db.execute(drop_task_table_sql);


/**** Create "task" table  ****/

const create_tasks_table_sql = `
    CREATE TABLE tasks (
        id INT NOT NULL AUTO_INCREMENT,
        task VARCHAR(45) NOT NULL,
        estimated_time INT NOT NULL,
        description VARCHAR(150) NULL,
        email VARCHAR(50) NULL,
        PRIMARY KEY (id)
    );
`
db.execute(create_tasks_table_sql);


/**** Create some sample items ****/

const insert_tasks_table_sql = `
    INSERT INTO tasks 
        (task, estimated_time, description) 
    VALUES 
        (?, ?, ?);
`
db.execute(insert_tasks_table_sql, ['task 1', '60', 'yeet']);

db.execute(insert_tasks_table_sql, ['task 2', '25', 'brr']);

db.execute(insert_tasks_table_sql, ['task 3', '89', 'thirdtimesthecharm']);

db.execute(insert_tasks_table_sql, ['task 4', '5', 'ezpeezylemonsqueezy']);


/**** Read the sample items inserted ****/

const read_tasks_table_sql = "SELECT * FROM tasks";

db.execute(read_tasks_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'tasks' initialized with:")
        console.log(results);
    }
);

db.end();
