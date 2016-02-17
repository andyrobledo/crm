/**
 * Created by Elizabeth on 29/01/2016.
 */

var mysql = require("mysql");

var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'tu host',
    user            : 'usuario',
    password        : 'password',
    database : "base de datos",
    debug: false
});


pool.getConnection(function(err, connection) {

    if(err){
        console.log("Error al conectar la BD: "+ err);
    }else{
        console.log("Conexion al 100! ")
    }

});

module.exports = pool;
