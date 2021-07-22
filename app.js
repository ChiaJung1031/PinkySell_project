const express = require('express');
const session=require('express-session')
const querystring = require('querystring'); 
const app = express();
let engine = require('ejs-locals');

app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.json()); 
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({extended:false}))
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true
}))


const user = require('./apis/api_user');
app.use('/api',user);
const checkuser = require('./apis/api_checkuser');
app.use('/api',checkuser);
const personal = require('./apis/api_personal');
app.use('/api',personal);
const profile = require('./apis/api_profile');
app.use('/api',profile);
const product = require('./apis/api_product');
app.use('/api',product);
const upload = require('./apis/api_upload');
app.use('/api',upload);
const index = require('./apis/api_index');
app.use('/api',index);
const category = require('./apis/api_category');
app.use('/api',category);

app.get('/', function(req, res){
    res.render('index');
});

app.get('/sell', function(req, res){
    res.render('uploadpic');
});

app.get('/personal/:id', function(req, res){
    res.render('personal');
});

app.get('/profile/:id', function(req, res){
    res.render('profile');
});

app.get('/message', function(req, res){
    res.render('message');
});

app.get('/product/:id', function(req, res){
    res.render('product');
});

app.get('/uploadpic/:id', function(req, res){
    res.render('uploadpic');
});
app.get('/category/:id', function(req, res){
    res.render('category');
});




app.listen(5000, function(){
    console.log('Example app listening at http://localhost:5000')
  });
  