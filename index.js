import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});
db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let books = [
  { id: 1, title: "", author: "", isbn: "", date_read: "", rating: "", review: "" },
]

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM book ORDER BY id ASC");
    const books = result.rows;

    const coverPromises = books.map(async (book) => {
      book.cover_url = "/images/placeholder.jpg";

      if (book.isbn) {
        try {
          const testUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
          const response = await axios.get(testUrl, { responseType: "arraybuffer" });

          if (
            response.headers &&
            response.headers["content-type"] &&
            response.headers["content-type"].includes("image")
          ) {
            book.cover_url = testUrl;
            await db.query("UPDATE book SET cover_url = $1 WHERE id = $2", [
              book.cover_url,
              book.id,
            ]);
          }
        } catch (error) {
          console.log(`Could not fetch cover for ISBN ${book.isbn}:`, error.message);
        }
      }
    });

    await Promise.all(coverPromises);

    res.render("index.ejs", { books });
  } catch (error) {
    console.error("Failed to load books:", error.message);
    res.render("index.ejs", { books: [], error: error.message });
  }
});


app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/add", async (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const isbn = req.body.isbn;
  const date_read = req.body.date;
  const rating = req.body.star;
  const review = req.body.review;
  try {
    await db.query(" INSERT INTO book (title, author, isbn, date_read, rating, review) VALUES($1,$2, $3, $4,$5,$6); ",
      [title, author, isbn, date_read, rating, review]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.get("/edit/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await db.query("SELECT * FROM book WHERE id=$1",
      [bookId]
    );
    const book = result.rows[0];
    if (!book) return res.status(404).send("Book not found");
    res.render("edit.ejs", { book: book });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading book");
  }
});

app.post("/update", async (req, res) => {
  const { id, title, author, isbn, date, star, review } = req.body;

  try {
    await db.query(
      "UPDATE book SET title = $1, author = $2, isbn = $3, date_read = $4, rating = $5, review = $6 WHERE id = $7",
      [title, author, isbn, date, star, review, id]
    );
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to update book");
  }

});

app.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await db.query("DELETE FROM book WHERE id=$1", [id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to delete the book");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});