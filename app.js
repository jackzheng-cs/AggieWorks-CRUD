import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";

const { Pool } = pkg;

// Load environmental variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Set up EJS as the view engine
app.set("view engine", "ejs");

// Middleware to serve static files and parse form data
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/**
 * Route: GET /
 * Description: Render the main landing page.
 */
app.get("/", (req, res) => {
  res.render("main", { title: "Welcome to Blogin" });
});

/**
 * Route: GET /blogs
 * Description: Display all blog posts from the PostgreSQL database.
 */
app.get("/blogs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM blogs");
    res.render("blogs", { blogs: result.rows, title: "My Blogs" });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Route: POST /blogs
 * Description: Create a new blog post in the PostgreSQL database.
 */
app.post("/blogs", async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO blogs (title, content) VALUES ($1, $2) RETURNING id",
      [title, content]
    );
    console.log("New blog created:", result.rows[0]);
    res.redirect("/blogs");
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

/**
 * Route: GET /blogs/:id
 * Description: Fetch a specific blog's details for editing.
 * Returns: JSON response with blog data.
 */
app.get("/blogs/:id", async (req, res) => {
  const blogId = parseInt(req.params.id, 10);
  try {
    const result = await pool.query("SELECT * FROM blogs WHERE id = $1", [
      blogId,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Blog not found");
    }
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Route: POST /blogs/:id
 * Description: Update a specific blog post in PostgreSQL.
 */
app.post("/blogs/:id", async (req, res) => {
  const blogId = parseInt(req.params.id, 10);
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "UPDATE blogs SET title = $1, content = $2 WHERE id = $3",
      [title, content, blogId]
    );
    if (result.rowCount > 0) {
      console.log("Blog updated:", { id: blogId, title, content });
      res.redirect("/blogs");
    } else {
      res.status(404).send("Blog not found");
    }
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Route: DELETE /blogs/:id
 * Description: Delete a specific blog post from PostgreSQL.
 */
app.delete("/blogs/:id", async (req, res) => {
  const blogId = parseInt(req.params.id, 10);
  try {
    const result = await pool.query("DELETE FROM blogs WHERE id = $1", [
      blogId,
    ]);
    if (result.rowCount > 0) {
      console.log(`Blog with ID ${blogId} deleted`);
      res.status(200).send("Blog deleted successfully");
    } else {
      res.status(404).send("Blog not found");
    }
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
