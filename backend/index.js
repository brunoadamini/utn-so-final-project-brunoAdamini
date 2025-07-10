const express = require("express");
const cors = require("cors");
const db = require("./db");

// Define express app
const app = express();
const port = 4000;

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/ping", (req, res) => res.json({ message: "pong" }));
app.get("/api/students", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

app.post("/api/students", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Nombre requerido" });

  try {
    const result = await db.query(
      "INSERT INTO students (name) VALUES ($1) RETURNING id, name",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});


app.get("/api/greet", (req, res) => {
  const name = req.query.name || "desconocido";
  res.json({ message: `¡Hola, ${name}!` });
});

app.get("/greet", (req, res) => {
  const name = req.query.name || "desconocido";
  res.json({ message: `¡Hola, ${name}!` });
});


// Start the server
app.listen(port, () => console.log(`App running on port ${port}`));
