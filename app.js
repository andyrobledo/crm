/**
 * Created by Elizabeth on 29/01/2016.
 */

var express = require("express");
var bodyParser = require("body-parser");

var app = express();

var contactos = require("./routes/Contactos");
var ordenes = require("./routes/Ordenes");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST,GET,DELETE,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// http:localhost:3000/hola
app.get("/ok", function(req,res,next){
    res.send("Hola Mundo!!.. Fecha:  " + new Date());
});

app.use("/contactos" , contactos);
app.use("/ordenes", ordenes);

// error handlers
/*
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json('error', {
        message: err.message,
        error: {}
    });
});

*/
module.exports = app;