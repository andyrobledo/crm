/**
 * Created by Elizabeth on 29/01/2016.
 */

var mysql = require("mysql");

var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : '192.168.0.160',
    user            : 'remoto',
    password        : 'nachito',
    database : "crm",
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