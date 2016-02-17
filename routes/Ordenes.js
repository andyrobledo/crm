var express = require("express");
var router = express.Router();
var conexion = require("../utils/conexion");

router.get("/", function (req, res, next) {
    var search = req.query.buscar;
    var sql = 'SELECT * FROM ordenes';

    if(search.length != undefined){
        //TODO:  ESCAPEAR ESTO SLQ INJECTION con conexion
        sql = ('SELECT * FROM ordenes WHERE obs LIKE "%'+search+'%" OR idcont LIKE "%'+search+'%" OR idord LIKE "%'+search+'%"');
    }
    conexion.query(sql, function (err, tickes) {
        if (err) {
            res.status(500).json({"error": err, "message": "Ha ocurrido un error "});
            next();
        } else {
            res.json({"result": tickes}).status(200);
        }
    });

});

// seleccionar un solo orden mediante id
router.get("/:idOrden", function (req, res, next) {

    var idOrden = req.params.idOrden;

    if (idOrden != undefined || idOrden > 0) {

        conexion.query('SELECT * FROM ordenes where idord = ?', [idOrden], function (err, resultado) {
            if (err) {

                res.status(500).json({"error": err, "message": "Ha ocurrido un error, favor de verificar "});
                next();
            } else {

                var cantidad = resultado.length;

                if (cantidad > 0) {

                    res.json({"result": resultado, "cantidad": cantidad}).status(200);

                } else {
                    res.status(204);
                    next();
                }
            }

        });

    } else {

        res.status(401);
    }
});

// insert into orden
router.post("/", function (req, res, next) {

    var nuevaorden = req.body;
    console.log("nueva orden: ",nuevaorden)

    if (nuevaorden.idcont != undefined && nuevaorden.obs != undefined && nuevaorden.duracion != undefined ) {

        conexion.query('INSERT INTO ordenes (idcont, obs, duracion) VALUES (?,?,?)', [nuevaorden.idcont, nuevaorden.obs, nuevaorden.duracion], function (err, resultado) {
            console.log(resultado);
            if (err > 1) {
                res.status(500).json({"error": err, "message": "Error "});
                next();
            } else {
                var cantidad = resultado.affectedRows;
                if (cantidad > 0) {
                    res.status(200).json();

                } else {
                    res.status(400).json();

                }
            }
        });
    } else {
        res.status(500).json();

    }
});

//actualizar por medio de id
router.post("/:idOrden", function (req, res, next) {

    var idOrden = req.params.idOrden;
    var idcont = req.body.idcont;
    var obs = req.body.obs;
    var duracion = req.body.duracion;


    if (idOrden != undefined || idOrden > 0) {

        conexion.query('UPDATE ordenes SET  idcont = ?, obs = ?, duracion = ? where idord = ?', [ idcont,obs,duracion, idOrden], function (err, resultado) {
            console.log(resultado);
            if (err > 1) {
                res.status(500).json({"error": err, "message": "Error "});
                next();
            } else {
                var cantidad = resultado.affectedRows;
                if (cantidad > 0) {
                    res.status(200).json();

                } else {
                    res.status(400).json();

                }
            }
        });
    } else {
        res.status(500).json();

    }
});

//delete

router.delete("/:idOrden", function (req, res, next) {

    var idOrden = req.params.idOrden;

    if (idOrden != undefined || idOrden > 0) {

        conexion.query('DELETE FROM ordenes where idord = ?', [idOrden], function (err, resultado) {
            console.log(resultado);
            if (err > 1) {
                res.status(500).json({"error": err, "message": "Error "});
                next();
            } else {
                var cantidad = resultado.affectedRows;
                if (cantidad > 0) {
                    res.status(200).json();

                } else {
                    res.status(400).json();

                }
            }
        });
    } else {
        res.status(500).json();

    }
});



module.exports = router;
