const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (!users.some(user => user.username === username)) {
            users.push({ username, password });
            res.status(200).json({ message: "User successfully registered. Now you can log in." });
        } else {
            res.status(409).json({ message: "User already exists!" });
        }
    } else {
        res.status(400).json({ message: "Username and password must be provided." });
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({message: "ISBN not found"});
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = Object.values(books).filter(book => book.author === author);
    res.status(200).json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = Object.values(books).filter(book => book.title === title);
    res.status(200).json(matchingBooks);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({message: "ISBN not found"});
    }
});

module.exports.general = public_users;

async function getListOfBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log('List of books:', response.data);
    } catch (error) {
        console.error(error);
    }
}

async function getBookDetailsByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log(`Details for ISBN ${isbn}:`, response.data);
    } catch (error) {
        console.error(error);
    }
}

async function getBookDetailsByAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(`Details for author ${author}:`, response.data);
    } catch (error) {
        console.error(error);
    }
}

async function getBookDetailsByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(`Details for title ${title}:`, response.data);
    } catch (error) {
        console.error(error);
    }
}

// Call the functions with example parameters
getListOfBooks();
getBookDetailsByISBN('1'); // Example ISBN
getBookDetailsByAuthor('Jane Austen'); // Example author
getBookDetailsByTitle('Pride and Prejudice'); // Example title
