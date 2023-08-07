const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return typeof username === 'string' && username.trim().length > 0;
  };
  

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
  };
  

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (authenticatedUser(username, password)) {
      const token = jwt.sign({ username }, 'access', { expiresIn: '1h' });
      req.session.authorization = { accessToken: token };
      res.status(200).json({ message: "User logged in", token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
  

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username; // Assuming username is stored in the user object in request
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "ISBN not found" });
    }
    
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    books[isbn].reviews[username] = review;
    
    return res.status(200).json({ message: "Review added/updated successfully" });
  });
  

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      if (books[isbn].reviews[req.user.username]) {
        delete books[isbn].reviews[req.user.username];
        res.status(200).json({ message: "Review deleted successfully" });
      } else {
        res.status(404).json({ message: "Review not found for user" });
      }
    } else {
      res.status(404).json({ message: "ISBN not found" });
    }
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
