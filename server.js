const express = require('express');
const articleRouter = require('./routes/article');
const Article = require('./model/article');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();

// Connect to MongoDB using async function
async function connectToDB() {
    try {
        await mongoose.connect('mongodb://localhost/BharatInternDatabase');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
}


// Call the function to connect to MongoDB
connectToDB();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies and handle HTTP verbs like PUT and DELETE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Home route to display all articles
app.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('article/index', { articles: articles });
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        res.status(500).send('Server error');
    }
});

// Use the article router for all routes starting with /article
app.use('/article', articleRouter);

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
