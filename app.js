const express = require("express");
const ejs = require("ejs");
const path = require("path");



// init app function
const app = express();

// add ejs middleware
app.set("view-engine",'ejs');
app.use(express.urlencoded({extended: false}));


const routes = require("./routes/allroutes");
app.use('/',routes);
app.use('/register',routes);

app.listen(3000,(err) => {
    if(err) {
        throw err;
    }
    else {
        console.log("server is running on port " + 3000 );
    }
})