const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {        
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Express.js Backend with SQLite!');
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.run(query, [name, email], function (err) {
        if (err) {
            res.status(500).send('Error inserting user: ' + err.message);
        } else {
            res.status(201).json({ id: this.lastID, name, email });
        }
    });
});

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).send('Error retrieving users: ' + err.message);
        } else {
            res.json(rows);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const routes = require('./routes');

app.use('/api', routes);
