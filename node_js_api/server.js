const express = require('express');
const morgan = require('morgan');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const app = express();

const Movie = require('./models/movies');

const dbURI = 'mongodb://localhost:27017/test_movies'

//-------------------------------------------------
const client = new MongoClient(dbURI);
async function runDBTest() {
  try {
    await client.connect();
    const db = client.db('test_movies');
    const collection = db.collection('movies');

    // Find the first document in the collection
    const first = await collection.findOne();
    console.log(first);
  } finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}
runDBTest().catch(console.error);
//---------------------------------------------------

mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

//---------------------------------------------------    

app.set('view engine','ejs');

//app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/add-movie', (req, res) => {
    const movie = new Movie({
        prodId : 104,
        price : 70,
        quantity : 240
    });
    movie.save()
    .then((result) => {
        res.send(result)
    })
    .catch((err) =>{
        console.log(err)
    });
})

app.use((req, res, next) => {
    console.log('new request made:');
    //console.log('host: ', req.hostname);
    //console.log('path: ', req.path);
    //console.log('method: ', req.method);
    next();
});

app.get('/', (req, res) => {
    //res.sendFile('./views/index.html', {root: __dirname});
    const blogs = [
        {title: 'Yoshi', snippet: 'abcdef'},
        {title: 'Mario', snippet: 'ghijkl'},
        {title: 'Bowser', snippet: 'mnopqr'}
    ]
    
    res.render('index', {title: 'Home', blogs});
})

app.get('/about', (req, res) => {
    //res.sendFile('./views/about.html', {root: __dirname});
    res.render('about', {title: 'About'});
})

app.get('/about-us', (req, res) => {
    res.redirect('/about');
})

app.get('/movies/create',(req, res) => {
    res.render('create', {title: 'Create a new Movie'});
})

app.use((req, res) =>{
    //res.status(404).sendFile('./views/404.html', {root: __dirname});
    res.status(404).render('404', {title: '404'});
})