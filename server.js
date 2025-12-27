import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";
import dotenv from 'dotenv'
import path from "path";
import { fileURLToPath } from 'url';
dotenv.config()
const { Pool } = pkg;
const app = express();
app.use(cors({
allowedOrigins:['file:///Users/chiranjeev/Downloads/Nova-Bootstrap5_beta1-1.0.0/index.html']
}))
const port = process.env.PORT||5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const result = await pool.query("SELECT NOW()");
console.log(result.rows);

(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Connected to Neon:", result.rows);
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();

// Route to handle form POST
app.post('/', async (req, res) => {
  const { name, email,number, subject,message } = req.body;
  const str_number=toString(number)
  try {
    await pool.query(
      "INSERT INTO users (name,email, phone, subject, message) VALUES ($1,$2,$3,$4,$5)",
      [name,email,str_number,subject,message]
    );
    res.json({ message: "Information saved successfully. We will contact you in 24 hours" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving user" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
