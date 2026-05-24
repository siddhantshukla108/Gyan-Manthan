const express = require('express');
const router = express.Router();
const axios = require('axios');
const Book = require('../models/Book');
const { verifyToken } = require('../middleware/auth');

// @route   GET /api/books/search?q=query
// @desc    Search books using Google Books API
// @access  Private (or Public, but let's keep it private for logged in users)
router.get('/search', verifyToken, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    let books = [];
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=12`);
      if (response.data.docs) {
        books = response.data.docs.map(item => ({
          googleBooksId: item.key.replace('/works/', ''),
          title: item.title,
          author: item.author_name ? item.author_name.join(', ') : 'Unknown Author',
          description: item.first_sentence ? (typeof item.first_sentence === 'string' ? item.first_sentence : item.first_sentence[0]) : "No description available.",
          thumbnail: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : null,
          pageCount: item.number_of_pages_median || 300,
          categories: item.subject ? item.subject.slice(0, 3) : ["General"]
        }));
      }
    } catch (apiError) {
      console.warn("Google Books API failed (quota/key issue). Using mock fallback data.");
      // Fallback mock data so user can still test the AI Plan Generation
      books = [
        {
          googleBooksId: "mock-atomic-habits",
          title: "Atomic Habits",
          author: "James Clear",
          description: "An easy and proven way to build good habits and break bad ones.",
          thumbnail: "https://books.google.com/books/publisher/content/images/frontcover/fFCjDQAAQBAJ?fife=w400-h600&source=gbs_api",
          pageCount: 320,
          categories: ["Self-Help"]
        },
        {
          googleBooksId: "mock-deep-work",
          title: "Deep Work",
          author: "Cal Newport",
          description: "Rules for focused success in a distracted world.",
          thumbnail: "https://books.google.com/books/content?id=c141CgAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
          pageCount: 304,
          categories: ["Productivity"]
        }
      ];
    }

    res.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// @route   POST /api/books/save
// @desc    Save a book to the database (User selects a book to read)
// @access  Private
router.post('/save', verifyToken, async (req, res) => {
  try {
    const { title, author, googleBooksId, description, thumbnail } = req.body;

    // Check if book already exists in DB
    let book = await Book.findOne({ googleBooksId });

    if (!book) {
      book = new Book({
        title,
        author,
        googleBooksId,
        description,
        thumbnail,
        sourceType: 'API'
      });
      await book.save();
    }

    res.json({ message: 'Book saved successfully', book });
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ error: 'Failed to save book' });
  }
});

module.exports = router;
