import express from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";

const app = express();
const port = 3000;

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

// Temporary in-memory storage for blogs
const blogs = [];
let id = 0;

/**
 * Route: GET /
 * Description: Render the main landing page.
 */
app.get("/", (req, res) => {
  res.render("main", { title: "Welcome to Blogin" });
});

/**
 * Route: GET /blogs
 * Description: Display all blog posts.
 */
app.get("/blogs", (req, res) => {
  res.render("blogs", { blogs, title: "My Blogs" });
});

/**
 * Route: POST /blogs
 * Description: Create a new blog post.
 */
app.post("/blogs", (req, res) => {
  const newBlog = {
    id: id++,
    title: req.body.title,
    content: req.body.content,
  };

  blogs.push(newBlog);

  console.log("New blog created:", newBlog);
  res.redirect("/blogs");
});

/**
 * Route: GET /blogs/:id
 * Description: Fetch a specific blog's details for editing.
 * Returns: JSON response with blog data.
 */
app.get("/blogs/:id", (req, res) => {
  const blogId = parseInt(req.params.id, 10);
  const blog = blogs.find((b) => b.id === blogId);

  if (blog) {
    res.json(blog);
  } else {
    res.status(404).send("Blog not found");
  }
});

/**
 * Route: POST /blogs/:id
 * Description: Update a specific blog post.
 */
app.post("/blogs/:id", (req, res) => {
  const blogId = parseInt(req.params.id, 10);
  const blog = blogs.find((b) => b.id === blogId);

  if (blog) {
    blog.title = req.body.title;
    blog.content = req.body.content;
    console.log("Blog updated:", blog);
    res.redirect("/blogs");
  } else {
    res.status(404).send("Blog not found");
  }
});

/**
 * Route: DELETE /blogs/:id
 * Description: Delete a specific blog post.
 */
app.delete("/blogs/:id", (req, res) => {
  const blogId = parseInt(req.params.id, 10);
  const blogIndex = blogs.findIndex((b) => b.id === blogId);

  if (blogIndex !== -1) {
    blogs.splice(blogIndex, 1);
    console.log(`Blog with ID ${blogId} deleted`);
    res.status(200).send("Blog deleted successfully");
  } else {
    res.status(404).send("Blog not found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
