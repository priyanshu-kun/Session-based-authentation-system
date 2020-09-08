// const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const bcrypt = require("bcrypt");


function initlizePassport(passport,getUserByEmail,getUserById) {

    // use passport middleware and use passport local staragity
    passport.use(new passportLocal({ usernameField: 'emailAddress' }, async (email, password, done) => {
        const user = getUserByEmail(email);
        // console.log("Here is your password",password)
        // console.log("Here is your email",email)
        // console.log("given user: ",user)

        if(user === null) {
            return done(null,false,{message: "No user avaliable with that email!"});
        }
        try {
            if(await bcrypt.compare(password,user.password)) {
               
                return done(null,user);
            }
            else {
                return done(null,false,{message: "given password is incorrect!"});
            }
        }
        catch (err) {
            return done(err)
        }
    }))

    // serialize user in session (mean: serializeUser determines which data of the user object should be stored in the session. )
    passport.serializeUser((user, done) => { done(null,user.id)})

    // deserialize user in the session storage (mean: get user to the session)
    passport.deserializeUser((id, done) => {
        return done(null,getUserById(id));
     })
}

module.exports = initlizePassport;