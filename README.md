# 📚 Book Notes

A personal book tracker web app built with **Node.js**, **Express**, **EJS**, and **PostgreSQL**.  
It lets you log books you’ve read, give them ratings, write short reviews, and automatically fetch cover images using the **Open Library API**.

---

## 🚀 Features

- Add, edit, and delete books from your collection  
- Automatically fetch book covers from ISBN numbers  
- View ratings and reviews in a clean, responsive layout  
- PostgreSQL database for persistent storage  
- Bootstrap-powered UI  

---

## 🧩 Tech Stack

- **Node.js** + **Express** for backend and routing  
- **EJS** templating for dynamic pages  
- **PostgreSQL** for database  
- **Axios** for fetching book covers from Open Library  
- **Bootstrap 5** for styling  

---

## ⚙️ Setup Instructions

Follow these steps to get the app running on your local machine 👇

### 1. Clone the Repository
```bash
git clone https://github.com/olympus-g/book-notes.git
cd book-notes
```

### 2. Install Dependencies
```bash
npm install
```
### 3. Create a .env File
```ini
DATABASE_PASSWORD=your_postgres_password_here
```
Make sure .env is in your .gitignore so your password is never uploaded to GitHub.

---

## 🗃️ Database Setup

### 1. Create the Database
Open your PostgreSQL shell or pgAdmin and run:
```sql
CREATE DATABASE books;
```

### 2. Create the Table
Switch to the books database and run:
```sql
CREATE TABLE book (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(200) NOT NULL,
  isbn VARCHAR(50) NOT NULL,
  date_read DATE NOT NULL,
  rating INTEGER NOT NULL,
  review TEXT NOT NULL,
  cover_url TEXT
);
```
### 3. Optional: Insert Sample Data
```sql
INSERT INTO book (title, author, isbn, date_read, rating, review) VALUES
('The Sword of Kaigen', 'M.L. Wang', '9780999491623', '2025-09-25', 4, 'A powerful standalone epic blending martial arts, elemental magic, and deeply human storytelling. Intense battles and emotional depth make it unforgettable. My only problem with it is the big setup at the end, which we now know will never be continued.'),
('Oathbringer', 'Brandon Sanderson', '9780765326379', '2025-02-07', 5, 'A massive and masterful continuation of The Stormlight Archive. Expands the world, deepens the characters, and delivers jaw-dropping payoffs.'),
('Small Gods', 'Terry Pratchett', '9780552138901', '2025-02-22', 5, 'A deeply funny and philosophical take on religion, belief, and power. Terry Pratchett explores the relationship between gods and followers with sharp wit and surprising depth.');
```

---

## 🧠 Running the App

### Start the server:
If you’re using nodemon (recommended):
```bash
nodemon index.js
```
Or simply:
```bash
node index.js
```
Then visit:
👉 http://localhost:3000

---

## 🖼️ Open Library Cover API
Book covers are automatically fetched using:
```ruby
https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
```
If no cover is found, a default placeholder image will be shown.
