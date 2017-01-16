var express = require('express');
var path = require('path');
var mongoose = require('mongoose')
var _ = require('underscore')
var Music = require('./models/music')
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/music')

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'bower_components')));
app.locals.moment = require('moment')
app.listen(port);

console.log('music started on port:' + port);

app.get('/', function(req, res) {
  Music.fetch(function(err, music) {
    if(err) {
      console.log(err);
    }
  })

  res.render('index', {
    title: 'music 首页',
    music: music
  });
});

app.get('/music/:id', function(req, res) {
  var id = req.params.id

  Music.findById(id, function(err, music) {
    res.render('detail', {
      title: 'music ' + music.title,
      music: music
    });
  })
});

// admin post music
app.post('/admin/music/new', function() {
  var id = req.body.music._id
  var musicObj = req.body.music
  var _music

  if (id != 'undefined') {
    Music.findById(id, function(err, music){
      if(err) {
        console.log(err);
      }

      _music = _.extend(music, musicObj)
      _music.save(function(err, music) {
        if(err) {
          console.log(err);
        }
        res.redirect('/music/' + music._id)
      })
    })
  }
  else {
    _music = new Music({
      title: musicObj.title,
      singer: musicObj.singer,
      language: musicObj.language,
      poster: musicObj.poster,
    })

    _music.save(function(err, music) {
      if(err) {
        console.log(err);
      }
      res.redirect('/music/' + music._id)
    })
  }
})

app.get('/admin/music', function(res, res) {
  res.render('admin', {
    title: 'music 后台录入页',
    music: {
      title: '',
      singer: '',
      language: '',
      poster: ''
    }
  });
});
