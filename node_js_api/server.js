const express = require('express');
const app = express();

app.set('view engine','ejs');
app.listen(3000);

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

app.get('/blogs/create',(req, res) => {
    res.render('create', {title: 'Create a new Blog'});
})

app.use((req, res) =>{
    //res.status(404).sendFile('./views/404.html', {root: __dirname});
    res.status(404).render('404', {title: '404'});
})