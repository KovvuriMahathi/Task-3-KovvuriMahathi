const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.json());

// Create Database
const db = new sqlite3.Database("database.db");

// Create Table
db.run(`
CREATE TABLE IF NOT EXISTS students(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)
`);

// GET all students
app.get("/students", (req, res) => {

    db.all("SELECT * FROM students", [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// POST student
app.post("/students", (req, res) => {

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required"
        });
    }

    db.run(
        "INSERT INTO students(name) VALUES(?)",
        [name],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Student added successfully",
                id: this.lastID
            });
        }
    );
});

app.listen(3000, () => {
    console.log("Database server running on port 3000");
});
app.put("/students/:id", (req, res) => {

    const { name } = req.body;
    const id = req.params.id;

    db.run(
        "UPDATE students SET name=? WHERE id=?",
        [name, id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Student updated successfully"
            });
        }
    );
});
app.delete("/students/:id", (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM students WHERE id=?",
        [id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Student deleted successfully"
            });
        }
    );
});