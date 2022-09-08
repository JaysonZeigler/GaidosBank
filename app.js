const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3306
const fs = require('fs');
const session = require('express-session');
const db = new sqlite3.Database('./gaidosBank.db', sqlite3.OPEN_READWRITE)

const sql = `INSERT INTO users (uID, Name )
                VALUES(?,?)`
const view = `SELECT * FROM users`


app.set('view engine', 'ejs');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) =>{
  res.render('home');
})


app.post('/login',(req, res) =>{
  let username = req.body.name;
	let password = req.body.id;
  if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.get(`SELECT * FROM users WHERE Name = ? AND uID = ?`, [username, password], function(error, results) {
			// If there is an issue with the query, output the error
			console.log(results);
			if (error) throw error;
			// If the account exists
			if (results) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to home page
				res.redirect('/home');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
})


app.get('/home', function(req, res) {
	// If the user is loggedin
	if (req.session.loggedin) {
		// Output username
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		// Not logged in
		res.send('Please login to view this page!');
	}
	res.end();
});


app.listen(port, (err) =>{
  if (err) {
    console.error(err);
  } else {
    console.log(`Running on port ${port}`);
  }
  
});

//db.close((err) => {
//if(err) return console.error(err.message);
//})