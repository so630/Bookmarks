const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose')
const cookieParser = require('cookie-parser')
let app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.use(session({
    secret: 'a;sldkjfa;sldkjf',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    data: Array
})
userSchema.plugin(passportLocalMongoose)

mongoose.connect('mongodb+srv://admin-soham:soham@cluster0.rgrzw.mongodb.net/BookmarksDB')

let User = mongoose.model('User', userSchema)


app.get('/', function(req, res) {
    console.log(req.isAuthenticated());
    res.sendFile(__dirname +'/views/home.html');
})

app.get('/signin', function(req, res) {
    if (req.isAuthenticated() && req.cookies.username) {
        res.redirect('/bookmarks')
    }
    res.sendFile(__dirname +'/views/signin.html');
})

app.post('/signin', function(req, res) {

    

    const user = new User({
        username: req.body.email, 
        password: req.body.password
    });

    req.login(user, (err) => {
        if (err) {
            console.log(err)
            res.redirect('/')
        } else {
            passport.authenticate('local');
            res.cookie('username', req.body.email, {
                maxAge: 24 * 10000000000
            })
            res.redirect('/bookmarks')
        }
    });
})

app.get('/register', function(req, res) {
    if (req.isAuthenticated() && req.cookies.username) {
        res.redirect('/bookmarks')
    }
    res.sendFile(__dirname +'/views/register.html');
})

app.post('/register', function(req, res) {
    User.register({username: req.body.email, active: false}, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            req.login(user, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect('/');
                } else {
                    passport.authenticate('local');
                    res.cookie('username', req.body.email, {
                        maxAge: 24 * 10000000000
                    })
                    res.redirect('/bookmarks')
                }
            })
        }
    })
})

app.get('/bookmarks', function(req, res) {
    if (req.isAuthenticated() && req.cookies.username) {
        res.sendFile(__dirname + '/views/index.html');
    } else {
        res.redirect('/')
    }
})

app.post('/data', function(req, res) {
    let username = req.body.username;
    User.findOne({username: username}, (err, user) => {
        if (err || !user) {
            console.log(err)
        } else {
            res.send(user.data);
        }
    })
})

app.post('/update', function(req, res) {
    let username = req.body.username;
    console.log(req.body);
    console.log("update " + username)
    User.updateOne({username: username}, {$set: {data: req.body.data}}, function(err, user) {
        if (err || !user) {
            console.log(err);
        } else {
            console.log("update " + user)
        }
    })
    res.sendStatus(200);
})

app.listen(process.env.PORT || 3001);