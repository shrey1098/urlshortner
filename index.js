require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const {websites} = require('./websites.js');
const {validURL} = require('./utils.js');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  // access url sent in the html form
  // check if string is a url 
  // if not, return error
  // if yes, return short url
  if (!validURL(req.body.url)) {
    res.json({error: 'Invalid URL'});
  }
  else {
    // check if url already exists in the database
    // if yes, return the index of the url in the database
    // if no, add the url to the database and return the index
    var url = req.body.url;
    var index = websites.indexOf(url);
    if (index === -1) {
      websites.push(url);
        index = websites.length - 1;
    }
    else {
      index += 1;
    }
    res.json({
      original_url: url,
      short_url: index
    })
    };
  }

);
 app.get('/api/shorturl/:index', function(req, res) {
  // access index sent in the url
  // check if index is a number
  // if not, return error
  // if yes, return the url
  var index = req.params.index;
  if (isNaN(index)) {
    res.json({error: 'Invalid index'});
  }
  else {
    res.redirect(websites[index-1]);
  }
}
 );



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
