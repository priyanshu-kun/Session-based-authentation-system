if(process.env.SESSION_SECREAT !== "production") {
    require("dotenv").config();
}
const router = require("express").Router();
const bcrypt = require("bcrypt")
const flash = require("express-flash");
const expressSession = require("express-session");
const UserDataBase = [];
const methodOverride = require("method-override");

const passport = require("passport");
const passportConfig = require("../passport-config");
passportConfig(passport,email => {
    // console.log(UserDataBase);
    return UserDataBase[0].email === email?UserDataBase[0]:null;
},id => {
    return UserDataBase[0].id === id?UserDataBase[0]:null;
})

// init flash library to show messages
router.use(flash());

// Session setup
router.use(expressSession({

    // It holds the secret key for session
    secret: process.env.SESSION_SECREAT,

    // Forces the session to be saved 
    // back to the session store 
    resave: false,

    // do not save uninitialized session
    saveUninitialized: false
}))

// initialize passport
router.use(passport.initialize());

// initialize session
router.use(passport.session());

// init method override
router.use(methodOverride("_method"));

router.get("/", isauthentation, (req, res) => {
    res.render("index.ejs", { name: req.user.name});
})

router.get("/login",isnotauthentation, (req, res) => {
    res.render("login.ejs");
})

router.get("/register",isnotauthentation, (req, res) => {
    res.render("register.ejs");
})

router.post("/login",isnotauthentation, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.delete("/logout",(req,res) => {
    req.logOut();
    res.redirect("/login");
})


router.post("/register",isnotauthentation, async (req, res) => {
    try {
        let cryptPassword = await bcrypt.hash(req.body.password, 10, (err, cryptString) => {
            if (!err) {
                // console.log(cryptString);
                UserDataBase.push({
                    id: Date.now().toString(),
                    name: req.body.name,
                    email: req.body.emailAddress,
                    password: cryptString
                })
                // console.log(UserDataBase);
                res.redirect("/login");
            }
            else {
                console.log("Ohhhh! shit you messed up your crypt password function...");
                res.redirect("/register");
            }
        });
    }
    catch(error) {
        res.redirect("/register");
    }
})


function isauthentation(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}

function isnotauthentation(req,res,next) {
    if(req.isAuthenticated()) {
        return res.redirect("/");
    }
    return next();
    
}

module.exports = router;
